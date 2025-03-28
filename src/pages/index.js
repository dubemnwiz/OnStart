import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserAndData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login'); // redirect if not logged in
      } else {
        setUser(session.user);
        await fetchTasks(session.user.id);
        await fetchProfiles();
        setLoading(false);
      }
    };

    getUserAndData();
  }, []);

  const fetchTasks = async (userId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) console.error('Error fetching tasks:', error);
    else setTasks(data);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) console.error('Error fetching profiles:', error);
    else setProfiles(data);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Onboarding Task Checklist</h1>
      <ul className="mb-10">
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 border p-3 rounded-md bg-white shadow">
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-gray-600">Due: {task.due_date}</p>
          </li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mb-4">Networking Recommendations</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id} className="mb-4 border p-4 rounded-md bg-white shadow">
            <p className="font-semibold">{profile.full_name}</p>
            <p className="text-sm text-gray-700">Role: {profile.role}</p>
            <p className="text-sm text-gray-700">Location: {profile.location}</p>
            <p className="text-sm text-gray-700">Interests: {profile.interests?.join(', ')}</p>
            <div className="mt-2">
              <a href={`mailto:${profile.email}`} className="text-blue-600 underline mr-4">Email</a>
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 underline mr-4">LinkedIn</a>
              <a href={profile.calendly_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Book Meeting</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
