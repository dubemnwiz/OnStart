import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import TaskCard from '../components/TaskCard';
import ProfileCard from '../components/ProfileCard';
import VideoModal from '../components/modals/VideoModal';
import ValuesModal from '../components/modals/ValuesModal';
import UploadModal from '../components/modals/UploadModal';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('tasks');
  const router = useRouter();

  const createUserIfNotExists = async (user) => {
    const { data } = await supabase
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

        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profileData);
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
      .order('milestone', { ascending: false })
      .order('due_date', { ascending: true });
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

  const handleTaskClick = (task) => {
    if (task.action_type === 'external') {
      window.open(task.action_target, '_blank');
    } else if (task.action_type === 'route') {
      router.push(task.action_target);
    } else if (task.action_type === 'modal') {
      setActiveModal(task.action_target);
    }
  };

  const groupTasksByMilestone = (tasks) => {
    const groups = {};
    tasks.forEach((task) => {
      const milestone = task.milestone || 'Other';
      if (!groups[milestone]) groups[milestone] = [];
      groups[milestone].push(task);
    });
    return groups;
  };

  if (loading) return <div className="loading">Loading...</div>;

  const employees = profiles.filter((p) => p.is_employee);
  const interns = profiles.filter((p) => !p.is_employee);
  const groupchats = [];

  return (
    <div className="network-layout">
      {activeModal === 'video' && <VideoModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'values' && <ValuesModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'upload' && <UploadModal onClose={() => setActiveModal(null)} />}

      <aside className="left-sidebar">
        <div class="logo">OnStart</div>
        <div className="profile-header">
          <Link href="/profile" style={{ textDecoration: 'none', color: 'black' }}>
            <div class="sidebar-profile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="avatar"
                  src={userProfile?.picture_url ? `/media/${userProfile.picture_url}` : '/media/default-avatar.png'}
                  alt="user"
                />
              <div class="sidebar-profile-info">
                <div><strong>{userProfile?.full_name || 'Name'}</strong></div>
                <div>{userProfile?.role} | {userProfile?.location}</div>
                <div>{userProfile?.team}</div>
              </div>
            </div>
          </Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li
              className={view === 'tasks' ? 'active' : ''}
              onClick={() => setView('tasks')}
            >
              Tasks
              {view === 'tasks' && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '33.33%' }}></div>
                </div>
              )}
            </li>
            <li
              className={view === 'networking' ? 'active' : ''}
              onClick={() => setView('networking')}
            >
              Network
            </li>
            <li>Modules</li>
            <li>AskAI</li>
          </ul>
          <div className="connections">
            <div className="connections-header">
              <div><strong>Quick Connections</strong></div>
              <div className='see-all'>See all</div>
            </div>
            <ul className="connection-list">
              <li>Anne Couture | <small>Manager</small></li>
              <li>Miriam Soleil | <small>Mentor</small></li>
              <li>Marie Laval | <small>Teammate</small></li>
              <li>Mark Morain | <small>Teammate</small></li>
            </ul>
          </div>
        </nav>
        <button className="button signout" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>

      <main className="network-main">
        
        {view === 'tasks' ? (
          <h1 className="network-title">Welcome, {userProfile?.full_name || 'Name'} - 74 days until start!</h1>
        ) : (
          <h1 className="network-title">Build your network at [company]</h1>
        )}

        {view === 'tasks' ? (
          <div className="timeline">
            {Object.entries(groupTasksByMilestone(tasks)).map(([milestone, group]) => (
              <div key={milestone} className="timeline-section">
                <div className="timeline-marker">
                  <span className="timeline-label">{milestone}</span>
                </div>
                <div className="timeline-tasks">
                  {group.map((task) => (
                    <TaskCard key={task.id} task={task} onTaskClick={handleTaskClick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="network-columns">
            <div className="network-column">
              <h2>Employees</h2>
              <div className="scrollable-column">
                {employees.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
            <div className="network-column">
              <h2>Interns</h2>
              <div className="scrollable-column">
                {interns.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
            <div className="network-column">
              <h2>Group Chats</h2>
              <div className="scrollable-column">
                <p>No group chats yet</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
