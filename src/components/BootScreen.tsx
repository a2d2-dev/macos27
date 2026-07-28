import { Apple } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSystemStore } from '../store/systemStore';

function prefersReducedMotion() {
  return typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function BootScreen() {
  const finishBoot = useSystemStore((state) => state.finishBoot);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    const finishDelay = reducedMotion ? 420 : 3400;
    const progressTimer = globalThis.setTimeout(() => setProgress(100), 80);
    const finishTimer = globalThis.setTimeout(() => {
      hasFinishedRef.current = true;
      setIsExiting(true);
      globalThis.setTimeout(finishBoot, reducedMotion ? 120 : 360);
    }, finishDelay);

    return () => {
      globalThis.clearTimeout(progressTimer);
      globalThis.clearTimeout(finishTimer);
    };
  }, [finishBoot]);

  const skipBoot = () => {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;
    setIsExiting(true);
    globalThis.setTimeout(finishBoot, prefersReducedMotion() ? 80 : 180);
  };

  return (
    <main
      className={`boot-screen ${isExiting ? 'boot-screen--exiting' : ''}`}
      aria-label="Starting macOS27"
      onClick={skipBoot}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          skipBoot();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="boot-screen__content" aria-hidden="true">
        <Apple className="boot-screen__logo" size={70} strokeWidth={1.7} />
        <div className="boot-screen__track">
          <div className="boot-screen__progress" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <style>{`
        .boot-screen {
          --boot-ease: cubic-bezier(0.32, 0.72, 0, 1);
          display: grid;
          place-items: center;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
          color: #fff;
          cursor: default;
          opacity: 1;
          transition: opacity 320ms var(--boot-ease);
        }

        .boot-screen--exiting {
          opacity: 0;
        }

        .boot-screen__content {
          display: grid;
          justify-items: center;
          gap: 58px;
          transform: translateY(-8px);
          opacity: 1;
          transition:
            opacity 420ms var(--boot-ease),
            transform 420ms var(--boot-ease);
        }

        .boot-screen--exiting .boot-screen__content {
          opacity: 0;
          transform: translateY(-8px) scale(0.985);
        }

        .boot-screen__logo {
          filter: drop-shadow(0 0 24px rgba(255, 255, 255, 0.18));
          opacity: 0.96;
          animation: boot-logo-materialize 460ms var(--boot-ease) both;
        }

        .boot-screen__track {
          width: min(240px, 42vw);
          height: 4px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.24);
        }

        .boot-screen__progress {
          height: 100%;
          border-radius: inherit;
          background: rgba(255, 255, 255, 0.92);
          transition: width 3200ms cubic-bezier(0.18, 0.82, 0.18, 1);
        }

        @keyframes boot-logo-materialize {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.965);
          }
          to {
            opacity: 0.96;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .boot-screen,
          .boot-screen__content,
          .boot-screen__progress {
            transition-duration: 160ms;
            transition-timing-function: ease;
          }

          .boot-screen__logo {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
