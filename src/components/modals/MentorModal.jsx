import React from 'react';

export default function MentorModal({ onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2>Meet Your Mentor</h2>
        <p>Schedule a 1:1 with your assigned mentor using the link you received on your first day.</p>
        <p>If you haven't received the link, reach out to your team lead or check the onboarding Slack channel.</p>
        <button className="button" onClick={onClose} style={{ marginTop: '1rem' }}>
          Got it
        </button>
      </div>
    </div>
  );
}