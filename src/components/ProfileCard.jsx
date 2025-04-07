export default function ProfileCard({ profile }) {
  return (
    <div className="profile-card" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '200px',
      height: '200px',
      textAlign: 'center'
    }}>
      <img
        src={profile.picture_url}
        alt={profile.full_name}
        style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }}
      />
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '8px' }}>{profile.full_name}</p>
        <p style={{ color: '#555', fontSize: '14px' }}>Role: {profile.role}</p>
        <p style={{ color: '#555', fontSize: '14px' }}>Location: {profile.location}</p>
        <p style={{ color: '#555', fontSize: '14px' }}>Interests: {profile.interests?.join(', ')}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
          <a href={`mailto:${profile.email}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>Email</a>
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>LinkedIn</a>
          <a href={profile.calendly_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Book Meeting</a>
        </div>
      </div>
    </div>
  );
}