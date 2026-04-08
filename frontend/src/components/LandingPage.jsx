import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/roleRedirect'
import frontImage from '../assets/front.jpg'
import logo1 from '../assets/logo1.png'

export default function LandingPage() {
  const { currentUser, isAuthenticated } = useAuth()

  if (isAuthenticated && currentUser?.role) {
    return <Navigate to={getDashboardPath(currentUser.role)} replace />
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --white: #ffffff;
          --ash-light: #f4f4f5;
          --ash-mid: #e4e4e7;
          --ash-deep: #a1a1aa;
          --ash-dark: #52525b;
          --primary: #0A192F;
          --primary-light: #e8edf5;
          --primary-dark: #081425;
          --text: #18181b;
          --text-soft: #52525b;
          --overlay-dark: rgba(0, 0, 0, 0.58);
          --overlay-soft: rgba(0, 0, 0, 0.32);
        }

        .lp-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--white);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .lp-header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 68px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--ash-mid);
        }

        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .lp-logo-img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 8px;
        }

        .lp-logo-name {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 17px;
          color: var(--text);
          line-height: 1.2;
        }

        .lp-logo-sub {
          font-size: 11px;
          color: var(--ash-deep);
          font-weight: 400;
        }

        .lp-nav-btns {
          display: flex;
          gap: 10px;
        }

        .lp-btn-ghost {
          padding: 9px 22px;
          border-radius: 10px;
          border: 1.5px solid var(--ash-mid);
          background: transparent;
          color: var(--text);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s;
          font-family: 'DM Sans', sans-serif;
        }

        .lp-btn-ghost:hover {
          background: var(--ash-light);
          border-color: var(--ash-deep);
        }

        .lp-btn-primary {
          padding: 9px 22px;
          border-radius: 10px;
          background: var(--primary);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.18s, box-shadow 0.18s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 2px 8px rgba(10,25,47,0.3);
        }

        .lp-btn-primary:hover {
          background: var(--primary-dark);
          box-shadow: 0 4px 14px rgba(10,25,47,0.4);
        }

        .lp-hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: calc(100vh - 68px);
          position: relative;
          background-image:
            linear-gradient(135deg, var(--overlay-dark), var(--overlay-soft)),
            url(${frontImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .lp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(10,25,47,0.22), transparent 22%),
            radial-gradient(circle at bottom left, rgba(255,255,255,0.12), transparent 25%);
          pointer-events: none;
        }

        .lp-hero-left {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .lp-heading {
          font-family: 'Sora', sans-serif;
          font-size: clamp(32px, 4.2vw, 56px);
          font-weight: 800;
          line-height: 1.15;
          color: #ffffff;
          margin-bottom: 20px;
          max-width: 850px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.28);
        }

        .lp-heading .accent {
          color: #0A192F;
          position: relative;
          display: inline-block;
          -webkit-text-stroke: 1px #ffffff;
          text-stroke: 1px #ffffff;
          text-shadow:
            -1px -1px 0 #ffffff,
             1px -1px 0 #ffffff,
            -1px  1px 0 #ffffff,
             1px  1px 0 #ffffff,
             0 4px 20px rgba(0,0,0,0.28);
        }

        .lp-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.92);
          line-height: 1.8;
          max-width: 700px;
          margin-bottom: 36px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.25);
        }

        .lp-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .lp-cta-main {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          background: var(--primary);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(10,25,47,0.35);
        }

        .lp-cta-main:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(10,25,47,0.45);
        }

        .lp-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(6px);
        }

        .lp-cta-secondary:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.4);
        }

        .lp-stats {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin-top: 52px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.22);
          width: 100%;
          max-width: 720px;
          flex-wrap: wrap;
        }

        .lp-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: center;
        }

        .lp-stat-num {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .lp-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.78);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .lp-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          width: 100%;
          max-width: 900px;
          margin-top: 40px;
        }

        .lp-card {
          background: rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,0.18);
          transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
          cursor: default;
          backdrop-filter: blur(8px);
        }

        .lp-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.2);
          transform: translateY(-2px);
          background: rgba(255,255,255,0.16);
        }

        .lp-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(10,25,47,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin: 0 auto 10px;
          border: 1px solid rgba(10,25,47,0.28);
        }

        .lp-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
        }

        .lp-footer {
          text-align: center;
          padding: 20px 48px;
          border-top: 1px solid var(--ash-mid);
          font-size: 13px;
          color: var(--ash-deep);
          background: var(--ash-light);
        }

        @media (max-width: 900px) {
          .lp-header {
            padding: 0 20px;
          }

          .lp-hero-left {
            padding: 48px 24px;
          }

          .lp-stats {
            gap: 18px;
          }

          .lp-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .lp-header {
            height: auto;
            padding: 16px 16px;
            flex-direction: column;
            gap: 12px;
          }

          .lp-nav-btns {
            width: 100%;
            justify-content: center;
          }

          .lp-heading {
            font-size: 32px;
          }

          .lp-desc {
            font-size: 15px;
          }

          .lp-cta-row {
            flex-direction: column;
            width: 100%;
          }

          .lp-cta-main,
          .lp-cta-secondary {
            width: 100%;
            justify-content: center;
          }

          .lp-cards-grid {
            grid-template-columns: 1fr;
          }

          .lp-stats {
            flex-direction: column;
            gap: 14px;
          }
        }
      `}</style>

      <div className="lp-root">
        <header className="lp-header">
          <div className="lp-logo">
            <img src={logo1} alt="Campus Hub Logo" className="lp-logo-img" />
            <div>
              <div className="lp-logo-name">Campus Hub</div>
              <div className="lp-logo-sub">Smart Campus Management</div>
            </div>
          </div>

          <div className="lp-nav-btns">
            <Link to="/login" className="lp-btn-ghost">Sign In</Link>
            <Link to="/register" className="lp-btn-primary">Sign Up</Link>
          </div>
        </header>

        <main className="lp-hero">
          <div className="lp-hero-left">
            <h1 className="lp-heading">
              One platform for your <span className="accent">entire campus</span>
            </h1>

            <div className="lp-cta-row">
              <Link to="/register" className="lp-cta-main">
                Get Started
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link to="/login" className="lp-cta-secondary">
                Sign in to your account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}