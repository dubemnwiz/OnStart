import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import Select from 'react-select';
import '../styles/profile.css';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef();

  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    role: '',
    team: '',
    location: '',
    description: '',
    interests: '',
    linkedin_url: '',
    calendly_url: '',
    picture_url: null,
  });

  const roleOptions = [
    { value: 'Intern', label: 'Intern' },
    { value: 'New Grad', label: 'New Grad' },
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Designer', label: 'Designer' },
  ];

  const locationOptions = [
    { value: 'New York', label: 'New York' },
    { value: 'San Francisco', label: 'San Francisco' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Austin', label: 'Austin' },
    { value: 'Seattle', label: 'Seattle' },
  ];

  const interestOptions = [
    { value: 'Photography', label: 'Photography' },
    { value: 'Videography', label: 'Videography' },
    { value: 'Graphic Design', label: 'Graphic Design' },
    { value: 'Digital Art', label: 'Digital Art' },
    { value: 'Animation', label: 'Animation' },
    { value: 'Writing', label: 'Writing' },
    { value: 'Journaling', label: 'Journaling' },
    { value: 'Poetry', label: 'Poetry' },
    { value: 'Music Production', label: 'Music Production' },
    { value: 'Singing', label: 'Singing' },
    { value: 'Playing Instruments', label: 'Playing Instruments' },
    { value: 'Podcasting', label: 'Podcasting' },
    { value: 'Acting', label: 'Acting' },
    { value: 'Fashion Design', label: 'Fashion Design' },
    { value: 'Crafting / DIY', label: 'Crafting / DIY' },
    { value: 'Interior Design', label: 'Interior Design' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Yoga', label: 'Yoga' },
    { value: 'Meditation', label: 'Meditation' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Baking', label: 'Baking' },
    { value: 'Gardening', label: 'Gardening' },
    { value: 'Hiking', label: 'Hiking' },
    { value: 'Running', label: 'Running' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Video Games', label: 'Video Games' },
    { value: 'Board Games', label: 'Board Games' },
    { value: 'Puzzle Solving', label: 'Puzzle Solving' },
    { value: 'Reading', label: 'Reading' },
    { value: 'Watching Movies', label: 'Watching Movies' },
    { value: 'Anime', label: 'Anime' },
    { value: 'Binge-watching Shows', label: 'Binge-watching Shows' },
    { value: 'K-pop / Pop Culture', label: 'K-pop / Pop Culture' },
    { value: 'Escape Rooms', label: 'Escape Rooms' },
    { value: 'Learning New Languages', label: 'Learning New Languages' },
    { value: 'Public Speaking', label: 'Public Speaking' },
    { value: 'Debate', label: 'Debate' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'History', label: 'History' },
    { value: 'Self-Improvement', label: 'Self-Improvement' },
    { value: 'Online Courses', label: 'Online Courses' },
    { value: 'Mentorship', label: 'Mentorship' },
    { value: 'Volunteering', label: 'Volunteering' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Activism', label: 'Activism' },
    { value: 'Sustainability', label: 'Sustainability' },
    { value: 'Cultural Exchange', label: 'Cultural Exchange' },
    { value: 'Event Planning', label: 'Event Planning' },
    { value: 'Community Building', label: 'Community Building' },
    { value: 'Social Media Content', label: 'Social Media Content' },
    { value: 'Organizing Meetups', label: 'Organizing Meetups' },
  ];

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
          description: data.description || '',
          interests: data.interests?.join(', ') || '',
          linkedin_url: data.linkedin_url || '',
          calendly_url: data.calendly_url || '',
          picture_url: data.picture_url || null,
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
      interests: Array.isArray(form.interests)
        ? form.interests
        : form.interests.split(',').map((i) => i.trim()),
    };

    const { error } = await supabase.from('users').upsert(payload);

    if (error) {
      alert('Error saving profile: ' + error.message);
    } else {
      alert('✅ Profile saved!');
      router.push('/');
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div className="profile-page">
      <div className="profile-box">
        <h1>Edit Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <label htmlFor="profile_picture">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.picture_url ? `/media/${form.picture_url}` : '/media/default-avatar.png'}
                alt="Profile"
                className="profile-upload-preview"
                onClick={triggerFileSelect}
              />
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="profile_picture"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => setForm({ ...form, picture_url: e.target.files[0].name })}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Full Name</label>
            <div>{form.full_name}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Role</label>
            <div>{form.role}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Team</label>
            <div>{form.team}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Location</label>
            <div>{form.location}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Interests</label>
            <Select
              isMulti
              name="interests"
              options={interestOptions}
              value={interestOptions.filter(opt => form.interests.includes(opt.value))}
              onChange={(selected) => setForm({ ...form, interests: selected.map((s) => s.value) })}
              className="react-select-container"
              classNamePrefix="select"
              placeholder="Search or select interests..."
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>LinkedIn URL</label>
            <input
              name="linkedin_url"
              type="text"
              value={form.linkedin_url}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Calendly URL</label>
            <input
              name="calendly_url"
              type="text"
              value={form.calendly_url}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="button">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
