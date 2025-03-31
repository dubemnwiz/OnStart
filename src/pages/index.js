import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const createUserIfNotExists = async (user) => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!data) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name || '',
        role: null,
        location: null,
        interests: [],
      });

      if (insertError) {
        console.error('Error inserting user:', insertError);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const getUserAndData = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!data?.session) {
        router.push('/login');
      } else {
        const user = data.session.user;
        setUser(user);
        await createUserIfNotExists(user);
        await fetchTasks(user.id);
        await fetchProfiles();
        setLoading(false);
      }
    };

    getUserAndData();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', '11111111-1111-1111-1111-111111111111');
    if (error) console.error('Error fetching tasks:', error);
    else setTasks(data);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error('Error fetching profiles:', error);
    else setProfiles(data);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome, {user?.email}</h1>
        <button className="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <section>
        <h2>Onboarding Task Checklist</h2>
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className="card">
              <p className="task-title">{task.title}</p>
              <p className="task-date">Due: {task.due_date}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Networking Recommendations</h2>
        <ul className="list">
          {profiles.map((profile) => (
            <li key={profile.id} className="card">
              <p><strong>{profile.full_name}</strong></p>
              <p>Role: {profile.role}</p>
              <p>Location: {profile.location}</p>
              <p>Interests: {profile.interests?.join(', ')}</p>
              <div className="links">
                <a href={`mailto:${profile.email}`}>Email</a>
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={profile.calendly_url} target="_blank" rel="noreferrer">Book Meeting</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
