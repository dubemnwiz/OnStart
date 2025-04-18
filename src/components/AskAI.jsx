import { useState } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { BsChatDots } from 'react-icons/bs';
import '../styles/askAI.css';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AskAI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [suggestions] = useState([
    'How do I set goals with my manager?',
    'How do I set up my email and accounts?',
    'How do I log time off or PTO?',
    'What does my team work on?'
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question) return;

    try {
      const res = await fetch('/api/askAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      if (res.status !== 200) {
        console.error('OpenAI error:', data.error);
        alert(data.error?.message || 'Rate limit hit or issue with API. Please try again later.');
        return;
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  const handleSuggestionClick = (text) => {
    setQuestion(text);
  };

  return (
    <div className="ask-ai-wrapper">
      <div className="ask-ai-icon">
        <BsChatDots size={40} />
      </div>
      <h1 className="ask-ai-heading">What do you want to know?</h1>
      <p className="ask-ai-subtext">Ask a question, get an answer using our company knowledge base.</p>

      <form onSubmit={handleSubmit} className="ask-ai-form">
        <input
          type="text"
          placeholder="What is the process for setting up my development environment?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {question && (
          <button type="button" onClick={() => setQuestion('')} className="ask-ai-clear">
            <FiX size={18} />
          </button>
        )}
        <button type="submit" className="ask-ai-submit">
          <FiSend size={18} />
        </button>
      </form>

      {answer && (
        <div className="ask-ai-answer">
          <p>{answer}</p>
        </div>
      )}

      <div className="ask-ai-suggestions">
        {suggestions.map((s, idx) => (
          <button key={idx} onClick={() => handleSuggestionClick(s)}>
            {s} ↗
          </button>
        ))}
      </div>
    </div>
  );
}
