import { useState } from 'react';
import { Mail, Linkedin, Calendar } from 'lucide-react';
import '../styles/profilecard.css';

export default function ProfileCard({ profile }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleConnect = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <>
      <div className="profile-card">
        <div className="profile-card-info">
          <img className="profile-picture" src={`/media/${profile.picture_url}`} alt={profile.full_name} />
          <div className="profile-card-info-section">
            <div className="profile-name">{profile.full_name}</div>
            <div className="profile-role-location">{profile.role}</div>
            <div className="profile-role-location">{profile.location}</div>
            <div className="profile-role-location">{profile.team}</div>
          </div>
        </div>
        {profile.matchScore !== undefined && (
          <p className="match-score">Match Score: {profile.matchScore}</p>
        )}
        <button className="connect-button" onClick={handleConnect}>Connect</button>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>✕</button>
            <img className="popup-picture" src={`/media/${profile.picture_url}`} alt={profile.full_name} />
            <h2 className="popup-name">{profile.full_name}</h2>
            <p className="popup-role-location">{profile.role} | {profile.location}</p>
            <p className="popup-role-location">{profile.team}</p>
            <p className="popup-description">{profile.description}</p>
            <p className="popup-description">
              <strong>Interests:</strong> {Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}
            </p>


            <div className="popup-icons">
              {profile.email && (
                <a href={`mailto:${profile.email}`} target="_blank" rel="noreferrer"><Mail size={20} /></a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
              )}
              {profile.calendly_url && (
                <a href={profile.calendly_url} target="_blank" rel="noreferrer"><Calendar size={20} /></a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
