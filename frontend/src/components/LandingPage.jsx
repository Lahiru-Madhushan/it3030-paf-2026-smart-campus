import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/roleRedirect'

export default function LandingPage() {
  const { currentUser, isAuthenticated } = useAuth()

  if (isAuthenticated && currentUser?.role) {
    return <Navigate to={getDashboardPath(currentUser.role)} replace />
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --white: #ffffff;
          --ash-light: #f4f4f5;
          --ash-mid: #e4e4e7;
          --ash-deep: #a1a1aa;
          --ash-dark: #52525b;
          --yellow: #f5c518;
          --yellow-light: #fef9e3;
          --yellow-dark: #d4a00a;
          --text: #18181b;
          --text-soft: #52525b;
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

        /* HEADER */
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

        .lp-logo-mark {
          width: 38px;
          height: 38px;
          background: var(--yellow);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #fff;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(245,197,24,0.35);
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
          background: var(--yellow);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.18s, box-shadow 0.18s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 2px 8px rgba(245,197,24,0.3);
        }

        .lp-btn-primary:hover {
          background: var(--yellow-dark);
          box-shadow: 0 4px 14px rgba(245,197,24,0.4);
        }

        /* HERO - FULL WIDTH SINGLE COLUMN */
        .lp-hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background:
            radial-gradient(circle at top right, rgba(245,197,24,0.12), transparent 20%),
            radial-gradient(circle at bottom left, rgba(161,161,170,0.10), transparent 22%),
            linear-gradient(to bottom, #ffffff, #fafafa);
        }

        .lp-hero-left {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--yellow-light);
          border: 1px solid rgba(245,197,24,0.3);
          color: #b07d00;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 24px;
          width: fit-content;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .lp-badge::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--yellow);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .lp-heading {
          font-family: 'Sora', sans-serif;
          font-size: clamp(32px, 4.2vw, 56px);
          font-weight: 800;
          line-height: 1.15;
          color: var(--text);
          margin-bottom: 20px;
          max-width: 850px;
        }

        .lp-heading .accent {
          color: var(--yellow-dark);
          position: relative;
          display: inline-block;
        }

        .lp-heading .accent::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--yellow);
          border-radius: 2px;
          opacity: 0.5;
        }

        .lp-desc {
          font-size: 16px;
          color: var(--text-soft);
          line-height: 1.8;
          max-width: 700px;
          margin-bottom: 36px;
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
          background: var(--yellow);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(245,197,24,0.35);
        }

        .lp-cta-main:hover {
          background: var(--yellow-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245,197,24,0.45);
        }

        .lp-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 12px;
          border: 1.5px solid var(--ash-mid);
          background: transparent;
          color: var(--text-soft);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }

        .lp-cta-secondary:hover {
          background: var(--ash-light);
          color: var(--text);
          border-color: var(--ash-deep);
        }

        /* STATS */
        .lp-stats {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin-top: 52px;
          padding-top: 32px;
          border-top: 1px solid var(--ash-mid);
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
          color: var(--text);
        }

        .lp-stat-label {
          font-size: 12px;
          color: var(--ash-deep);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* FEATURE CARDS */
        .lp-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          width: 100%;
          max-width: 900px;
          margin-top: 40px;
        }

        .lp-card {
          background: var(--white);
          border-radius: 16px;
          padding: 18px 20px;
          border: 1px solid var(--ash-mid);
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }

        .lp-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .lp-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--yellow-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin: 0 auto 10px;
          border: 1px solid rgba(245,197,24,0.2);
        }

        .lp-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text);
          text-align: center;
        }

        /* FOOTER */
        .lp-footer {
          text-align: center;
          padding: 20px 48px;
          border-top: 1px solid var(--ash-mid);
          font-size: 13px;
          color: var(--ash-deep);
          background: var(--ash-light);
        }

        /* RESPONSIVE */
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
        {/* HEADER */}
        <header className="lp-header">
          <div className="lp-logo">
            <div className="lp-logo-mark">CH</div>
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

        {/* HERO */}
        <main className="lp-hero">
          <div className="lp-hero-left">
            <span className="lp-badge">Campus Management</span>

            <h1 className="lp-heading">
              One platform for your <span className="accent">entire campus</span>
            </h1>

            <p className="lp-desc">
              Manage students, staff, and admins with secure OTP verification,
              role-based dashboards, and real-time campus controls — all in one place.
            </p>

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

            <div className="lp-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">3</span>
                <span className="lp-stat-label">User Roles</span>
              </div>
              <div className="lp-stat">
                <span className="lp-stat-num">OTP</span>
                <span className="lp-stat-label">Verified</span>
              </div>
              <div className="lp-stat">
                <span className="lp-stat-num">100%</span>
                <span className="lp-stat-label">Secure Access</span>
              </div>
            </div>

            <div className="lp-cards-grid">
              {[
                { icon: '✉️', title: 'OTP Verification' },
                { icon: '🔐', title: 'Password Reset' },
                { icon: '🧭', title: 'Role Dashboards' },
                { icon: '⚙️', title: 'Admin Controls' },
              ].map((c) => (
                <div className="lp-card" key={c.title}>
                  <div className="lp-card-icon">{c.icon}</div>
                  <div className="lp-card-title">{c.title}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="lp-footer">
          © {new Date().getFullYear()} Campus Hub · Smart Campus Management System
        </footer>
      </div>
    </>
  )
}