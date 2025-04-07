import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import TaskCard from '../components/TaskCard';
import ProfileCard from '../components/ProfileCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('tasks');
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
      const { data } = await supabase.auth.getSession();

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
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) console.error('Error fetching tasks:', error);
    else setTasks(data);
  };

  const fetchProfiles = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', userId);

    if (error) console.error('Error fetching profiles:', error);
    else setProfiles(data);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">On-Start</h2>
        <ul className="nav">
          <li className={view === 'tasks' ? 'active' : ''} onClick={() => setView('tasks')}>
            📋 Tasks
          </li>
          <li className={view === 'networking' ? 'active' : ''} onClick={() => setView('networking')}>
            🤝 Networking
          </li>
        </ul>
        <button className="button signout" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>

      <main className="main">
        <h1>{view === 'tasks' ? 'Onboarding Task Checklist' : 'Networking Recommendations'}</h1>

        {view === 'tasks' ? (
          <ul className="list">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <ul className="list">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
