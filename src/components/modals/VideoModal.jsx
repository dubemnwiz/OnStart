import '../../styles/modals.css'

export default function VideoModal({ onClose }) {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={onClose}>✕</button>
          <h2>Onboarding Video</h2>
          <video width="100%" controls>
            <source src="/media/onboarding-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }
  