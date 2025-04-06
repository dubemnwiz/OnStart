export default function TaskCard({ task }) {
  return (
    <div className="task-card" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      marginBottom: '16px'
    }}>
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{task.title}</p>
      <p style={{ color: '#555', fontSize: '14px' }}>Due: {task.due_date}</p>
    </div>
  );
}
