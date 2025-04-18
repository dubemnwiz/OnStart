import React from 'react';

export default function DevEnvModal({ onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2>Setup Dev Environment</h2>
        <p>Follow these steps to get your local dev environment running:</p>
        <ul>
          <li>1. Clone the GitHub repository</li>
          <li>2. Run <code>npm install</code> to install dependencies</li>
          <li>3. Start the development server using <code>npm run dev</code></li>
          <li>4. Confirm you can access the local site on <code>http://localhost:3000</code></li>
        </ul>
        <button className="button" onClick={onClose} style={{ marginTop: '1rem' }}>
          All set
        </button>
      </div>
    </div>
  );
}
