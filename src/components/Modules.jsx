import { useState } from 'react';
import '../styles/modules.css';

export default function Modules() {
  const [activeModule, setActiveModule] = useState(null);

  const cultureModules = [
    {
      title: 'Values & Mission',
      description: 'Understand what drives OnStart and how we define success together.',
    },
    {
      title: 'Communication Norms',
      description: 'Learn how we collaborate across teams, including preferred tools and cadences.',
    },
    {
      title: 'Workplace Etiquette',
      description: 'Explore expectations for professional conduct, meetings, and async communication.',
    }
  ];

  const toolsModules = [
    {
      title: 'Frontend Stack',
      description: 'Get familiar with React, TailwindCSS, and our component library.',
    },
    {
      title: 'Backend Services',
      description: 'Intro to our Node.js services, RESTful API patterns, and testing standards.',
    },
    {
      title: 'Dev Tools & CI/CD',
      description: 'Overview of our dev environment, GitHub flows, and deployment pipelines.',
    }
  ];

  const handleCardClick = (module) => {
    setActiveModule(module);
  };

  const closeModal = () => setActiveModule(null);

  return (
    <>
      <h1 className="network-title">Explore your learning modules</h1>
      <div className="network-columns">
        <div className="network-column">
          <h2>Company Culture</h2>
          <div className="scrollable-column single-line">
            {cultureModules.map((mod, idx) => (
              <div key={idx} className="module-card" onClick={() => handleCardClick(mod)}>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="network-column">
          <h2>Frameworks & Tools</h2>
          <div className="scrollable-column single-line">
            {toolsModules.map((mod, idx) => (
              <div key={idx} className="module-card" onClick={() => handleCardClick(mod)}>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="network-column">
          <h2>Coming Soon</h2>
          <div className="scrollable-column single-line">
            <p>More modules are on the way!</p>
          </div>
        </div>
      </div>

      {activeModule && (
        <div className="module-modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>{activeModule.title}</h2>
            <p>{activeModule.description}</p>
          </div>
        </div>
      )}
    </>
  );
}
