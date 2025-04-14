import { useState } from 'react';

export default function UploadModal({ onClose }) {
  const [files, setFiles] = useState(null);

  const handleUpload = () => {
    // logic to send to Supabase Storage or backend here
    alert('Files submitted!');
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <h2>Upload Onboarding Documents</h2>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          style={{ marginTop: '1rem' }}
        />
        <button className="button" onClick={handleUpload} style={{ marginTop: '1rem' }}>
          Submit
        </button>
      </div>
    </div>
  );
}
