import React from 'react';
import ReactDOM from 'react-dom/client';
import { BootScreen } from './components/BootScreen';
import { Desktop } from './components/Desktop';
import { LoginScreen } from './components/LoginScreen';
import { useSystemStore } from './store/systemStore';
import './styles/glass.css';
import './styles/index.css';

function App() {
  const phase = useSystemStore((state) => state.phase);
  const setNow = useSystemStore((state) => state.setNow);

  React.useEffect(() => {
    setNow(new Date());
    const timer = globalThis.setInterval(() => setNow(new Date()), 1000);
    return () => globalThis.clearInterval(timer);
  }, [setNow]);

  if (phase === 'boot') {
    return <BootScreen />;
  }

  if (phase === 'login') {
    return <LoginScreen />;
  }

  return <Desktop />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
