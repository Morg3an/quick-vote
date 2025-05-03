import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import VoteResult from '../components/VoteResult';
import PollOption from '../components/PollOption';

const PollView = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const token = searchParams.get('adminToken');
    setAdminToken(token);
  }, [searchParams]);

  const fetchPoll = useCallback(async () => {
    const { data, error } = await supabase
      .from('polls')
      .select('id, question, options, is_closed, closes_at, admin_token, votes (id, option_index)')
      .eq('id', id)
      .single();

    if (!error && data) {
      const now = new Date();
      const isTimeClosed = data.closes_at && new Date(data.closes_at) <= now;

      const optionVotes = data.options.map((text, index) => ({
        id: index,
        text,
        voteCount: data.votes.filter((v) => v.option_index === index).length
      }));

      setPoll({
        id: data.id,
        question: data.question,
        options: optionVotes,
        isClosed: data.is_closed || isTimeClosed,
        adminToken: data.admin_token
      });
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchPoll();

    const voteChannel = supabase
      .channel('poll_votes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${id}`
        },
        (payload) => {
          console.log('Real-time vote update:', payload);
          fetchPoll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(voteChannel);
    };
  }, [fetchPoll, id]);

  const handleVote = async () => {
    if (selectedOption === null || poll?.isClosed) return;

    const { error } = await supabase.from('votes').insert([
      {
        poll_id: id,
        option_index: selectedOption.id
      }
    ]);

    if (!error) {
      setSelectedOption(null);
    }
  };

  const handleDelete = async () => {
    if (!poll || adminToken !== poll.adminToken) return;

    const confirmed = window.confirm('Are you sure you want to delete this poll? This cannot be undone.');
    if (!confirmed) return;

    const { error } = await supabase.from('polls').delete().eq('id', poll.id);

    if (!error) {
      alert('Poll deleted successfully.');
      navigate('/home');
    } else {
      alert('Failed to delete poll.');
    }
  };

  if (loading) return <p className="text-center p-6">Loading poll...</p>;
  if (!poll) return <p className="text-center p-6">Poll not found.</p>;

  const isAdmin = adminToken && adminToken === poll.adminToken;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">{poll.question}</h2>

      <div className="space-y-2">
        {poll.options.map((option) => (
          <PollOption
            key={option.id}
            option={option}
            selected={selectedOption?.id === option.id}
            onSelect={() => !poll.isClosed && setSelectedOption(option)}
          />
        ))}
      </div>

      {poll.isClosed ? (
        <p className="text-red-600 font-semibold">Voting is closed for this poll.</p>
      ) : (
        <button
          onClick={handleVote}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={selectedOption === null}
        >
          Submit Vote
        </button>
      )}

      <VoteResult results={poll.options} />

      {isAdmin && (
        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🗑️ Delete Poll
          </button>
        </div>
      )}
    </div>
  );
};

export default PollView;