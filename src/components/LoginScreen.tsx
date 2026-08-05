import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatSystemClock, useSystemStore } from '../store/systemStore';

function prefersReducedMotion() {
  return typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function LoginScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const timerRef = useRef<number | null>(null);
  const theme = useSystemStore((state) => state.theme);
  const wallpaperId = useSystemStore((state) => state.wallpaperId);
  const now = useSystemStore((state) => state.now);
  const enterDesktop = useSystemStore((state) => state.enterDesktop);

  const login = useCallback(() => {
    if (isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);
    timerRef.current = globalThis.setTimeout(enterDesktop, prefersReducedMotion() ? 180 : 620);
  }, [enterDesktop, isLoggingIn]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        login();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [login]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        globalThis.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <main className={`login-screen theme-${theme} desktop-wallpaper wallpaper-${wallpaperId}`} aria-label="Login screen">
      <div className="login-screen__backdrop" aria-hidden="true" />
      <time className="login-screen__time" dateTime={now.toISOString()}>
        {formatSystemClock(now)}
      </time>
      <section className={`login-screen__user ${isLoggingIn ? 'login-screen__user--logging-in' : ''}`} aria-label="User Claude">
        <button type="button" className="login-screen__avatar" aria-label="Log in as Claude" onClick={login} disabled={isLoggingIn}>
          {isLoggingIn ? <LoaderCircle className="login-screen__spinner" size={34} aria-hidden="true" /> : <span>C</span>}
        </button>
        <h1>Claude</h1>
        <p>{isLoggingIn ? 'Logging in...' : 'Click to log in'}</p>
      </section>
      <style>{`
        .login-screen {
          --login-ease: cubic-bezier(0.32, 0.72, 0, 1);
          position: relative;
          display: grid;
          min-height: 100vh;
          width: 100vw;
          place-items: center;
          overflow: hidden;
          color: white;
          isolation: isolate;
        }

        .login-screen::before,
        .login-screen::after {
          filter: blur(18px) saturate(150%);
          transform: scale(1.04);
        }

        .login-screen__backdrop {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse at 50% 38%, rgba(255, 255, 255, 0.14), transparent 34%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
        }

        .theme-dark.login-screen .login-screen__backdrop {
          background:
            radial-gradient(ellipse at 50% 38%, rgba(255, 255, 255, 0.08), transparent 32%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.64));
        }

        .login-screen__time {
          position: absolute;
          top: clamp(34px, 8vh, 82px);
          left: 50%;
          z-index: 2;
          width: min(86vw, 520px);
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.96);
          font-size: clamp(18px, 2.25vw, 28px);
          font-weight: 650;
          line-height: 1.1;
          text-align: center;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.48);
        }

        .login-screen__user {
          position: relative;
          z-index: 2;
          display: grid;
          justify-items: center;
          gap: 10px;
          transform: translateY(10px);
          opacity: 0;
          animation: login-user-materialize 430ms var(--login-ease) 90ms forwards;
          will-change: opacity, transform;
        }

        .login-screen__avatar {
          display: grid;
          width: 98px;
          height: 98px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.48);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.44), transparent 28%),
            linear-gradient(145deg, #00c7be 0%, #0a84ff 52%, #5e5ce6 100%);
          box-shadow:
            0 20px 56px rgba(0, 0, 0, 0.34),
            inset 0 1px 1px rgba(255, 255, 255, 0.34);
          color: white;
          font-size: 34px;
          font-weight: 700;
          line-height: 1;
          outline: none;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.24);
          transition:
            transform 180ms cubic-bezier(0.25, 1, 0.5, 1),
            box-shadow 180ms cubic-bezier(0.25, 1, 0.5, 1),
            opacity 240ms var(--login-ease);
        }

        .login-screen__avatar:hover,
        .login-screen__avatar:focus-visible {
          transform: scale(1.035);
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.38),
            0 0 0 4px rgba(255, 255, 255, 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.34);
        }

        .login-screen__avatar:active {
          transform: scale(0.97);
        }

        .login-screen__avatar:disabled {
          cursor: default;
        }

        .login-screen__user h1 {
          margin: 4px 0 0;
          color: rgba(255, 255, 255, 0.98);
          font-size: 18px;
          font-weight: 650;
          line-height: 1.2;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.5);
        }

        .login-screen__user p {
          margin: 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.3;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.48);
        }

        .login-screen__user--logging-in {
          transform: translateY(0) scale(0.985);
          opacity: 0.92;
          transition:
            opacity 320ms var(--login-ease),
            transform 320ms var(--login-ease);
        }

        .login-screen__spinner {
          animation: login-spinner 760ms linear infinite;
        }

        @keyframes login-user-materialize {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes login-spinner {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-screen__user {
            animation: none;
            transform: none;
            opacity: 1;
          }

          .login-screen__avatar,
          .login-screen__user--logging-in {
            transition: opacity 160ms ease;
            transform: none;
          }

          .login-screen__spinner {
            animation: none;
          }
        }

        @media (prefers-reduced-transparency: reduce) {
          .login-screen__backdrop {
            background: rgba(20, 24, 32, 0.82);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }

        @media (prefers-contrast: more) {
          .login-screen__time,
          .login-screen__user h1,
          .login-screen__user p {
            color: #fff;
            text-shadow: 0 2px 6px #000;
          }

          .login-screen__avatar {
            border-color: #fff;
            box-shadow: 0 0 0 2px #000;
          }
        }
      `}</style>
    </main>
  );
}
