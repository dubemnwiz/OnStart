export default function ValuesModal({ onClose }) {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={onClose}>✕</button>
          <h2>Our Company Values</h2>
          <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
            <li><strong>Integrity:</strong> We do the right thing, even when no one is watching.</li>
            <li><strong>Innovation:</strong> We embrace creativity and change.</li>
            <li><strong>Collaboration:</strong> We win together.</li>
            <li><strong>Customer Obsession:</strong> We prioritize the people we serve.</li>
          </ul>
        </div>
      </div>
    );
  }
  