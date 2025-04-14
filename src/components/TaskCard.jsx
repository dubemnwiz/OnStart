export default function TaskCard({ task, onTaskClick }) {
  const isCompleted = task.is_completed;

  return (
    <div className="task-card" 
      onClick={() => onTaskClick(task)} 
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        backgroundColor: 'white'
    }}>
      <div>
      <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px', cursor: 'default' }}>
        {task.title}
      </p>
      <p style={{ color: '#555', fontSize: '14px', marginBottom: '6px', cursor: 'default' }}>
        {task.description}
      </p>
      </div>

      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: isCompleted ? '2px solid #22c55e' : '2px solid #ccc',
          backgroundColor: isCompleted ? '#22c55e' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: 'white',
          marginLeft: '1rem'
        }}
      >
        {isCompleted ? '✓' : ''}
      </div>
    </div>
  );
}
