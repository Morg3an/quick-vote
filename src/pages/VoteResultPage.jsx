import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import VoteResult from '../components/VoteResult';

const VoteResultPage = () => {
    const { id } = useParams();
    const [results, setResults] = useState([]);
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pollQuestion, setPollQuestion] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const adminToken = new URLSearchParams(window.location.search).get('adminToken');

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) {
                console.error('Auth fetch error:', authError);
            }
            const userId = user?.id;
            console.log('Current User ID:', userId);

            const { data: poll, error: pollError } = await supabase
                .from('polls')
                .select('question, options, is_closed, created_by, admin_token')
                .eq('id', id)
                .single();

            if (pollError) {
                console.error('Poll fetch error:', pollError);
                setLoading(false);
                return;
            }

            console.log('Fetched poll:', poll);

            const userIsCreator = poll.created_by === userId;
            const isClosed = poll.is_closed;
            const isAdmin = adminToken && adminToken === poll.admin_token;

            console.log('Permissions => userIsCreator:', userIsCreator, '| isClosed:', isClosed, '| isAdmin:', isAdmin);

            if (userIsCreator || isClosed || isAdmin) {
                setAllowed(true);
                setPollQuestion(poll.question);

                const { data: votes, error: votesError } = await supabase
                    .from('votes')
                    .select('option_index')
                    .eq('poll_id', id);

                if (votesError) {
                    console.error('Vote fetch error:', votesError);
                    setLoading(false);
                    return;
                }

                console.log('Fetched votes:', votes);

                const counts = Array(poll.options.length).fill(0);
                votes.forEach(vote => {
                    if (vote.option_index >= 0 && vote.option_index < counts.length) {
                        counts[vote.option_index]++;
                    }
                });

                const formattedResults = poll.options.map((text, idx) => ({
                    text,
                    votes: counts[idx]
                }));

                console.log('Formatted results for chart:', formattedResults);

                setResults(formattedResults);
            } else {
                console.warn('Access denied for user to view results.');
            }

            setLoading(false);
        };

        fetchResults();
    }, [id]);

    if (loading) return <p className="text-center p-6">Loading results...</p>;
    if (!allowed) return <p className="text-center p-6 text-red-500">You are not authorized to view these results.</p>;

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4 text-center">
            <h2 className="text-2xl font-bold mb-4">📊 Results for: {pollQuestion}</h2>
            <VoteResult results={results} />
        </div>
    );
};

export default VoteResultPage;