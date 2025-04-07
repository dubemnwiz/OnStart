import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    role: '',
    team: '',
    location: '',
    interests: '',
    linkedin_url: '',
    calendly_url: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const currentUser = session?.session?.user;

      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUserId(currentUser.id);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name || '',
          role: data.role || '',
          team: data.team || '',
          location: data.location || '',
          interests: data.interests?.join(', ') || '',
          linkedin_url: data.linkedin_url || '',
          calendly_url: data.calendly_url || '',
        });
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: userId,
      ...form,
      interests: form.interests.split(',').map((i) => i.trim()),
    };

    const { error } = await supabase.from('users').upsert(payload);

    if (error) {
      alert('Error saving profile: ' + error.message);
    } else {
      alert('✅ Profile saved!');
      router.push('/');
    }
  };

  return (
    <div className="container">
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {['full_name', 'role', 'team', 'location', 'linkedin_url', 'calendly_url'].map((field) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label>{field.replace('_', ' ')}:</label>
            <input
              name={field}
              type="text"
              value={form[field]}
              onChange={handleChange}
              className="card"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label>Interests (comma-separated):</label>
          <input
            name="interests"
            type="text"
            value={form.interests}
            onChange={handleChange}
            className="card"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <button type="submit" className="button">Save Profile</button>
      </form>
    </div>
  );
}
