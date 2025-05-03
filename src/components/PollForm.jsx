import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const generateAdminToken = () => {
  return crypto.randomUUID();
};

const PollForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [adminLink, setAdminLink] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (!question.trim() || filteredOptions.length < 2) {
      setMessage("Question and at least 2 options are required.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setAdminLink(null);

    const adminToken = generateAdminToken();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('polls')
        .insert([
          {
            question: question.trim(),
            options: filteredOptions,
            admin_token: adminToken,
            created_by: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const pollId = data.id;
      const adminUrl = `${window.location.origin}/poll/${pollId}?adminToken=${adminToken}`;
      setAdminLink(adminUrl);
      setMessage("✅ Poll created successfully!");
      setQuestion('');
      setOptions(['', '']);

      if (onSubmit) onSubmit(data);

    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Create a New Poll</h2>

      {message && <div className="text-sm text-red-600">{message}</div>}

      {adminLink && (
        <div className="text-sm text-green-600 break-all">
          Admin Link: <a href={adminLink} className="underline text-blue-600">{adminLink}</a>
        </div>
      )}

      <input
        type="text"
        className="w-full border px-3 py-2 rounded"
        placeholder="Enter your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />

      {options.map((option, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 border px-3 py-2 rounded"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-red-500"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={addOption}
          disabled={options.length >= 5}
          className="text-sm text-blue-600"
        >
          + Add Option
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </form>
  );
};

export default PollForm;