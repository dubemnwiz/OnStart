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
      .select('*');
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
  
    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data);
    }
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
            <TaskCard task={task}/>
          ))}
        </ul>
      </section>

      <section>
        <h2>Networking Recommendations</h2>
        <ul className="list">
          {profiles.map((profile) => (
            <ProfileCard profile={profile}/>
          ))}
        </ul>
      </section>
    </div>
  );
}
