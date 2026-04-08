import { useNavigate } from 'react-router-dom'
import FacilitiesWorkspace from '../components/resources/FacilitiesWorkspace'
import Header from '../components/dashboard/UserDashboard'
import Footer from '../components/dashboard/userFooter'
import { useAuth } from '../context/AuthContext'

export default function UserFacilitiesPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <Header />
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(239,111,55,0.12),_transparent_30%),linear-gradient(135deg,_#08111a,_#111927_45%,_#0b131d)]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(3,8,15,0.24)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">
              Facilities and Assets
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white">
              Browse the smart campus catalogue
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              This workspace now runs fully inside the main Campus Hub project, so users and
              admins stay on the existing login system while the facilities catalogue, QR
              summaries, and asset issue reporting use the merged smartcampus experience.
            </p>
          </div>
          <FacilitiesWorkspace />
        </div>
      </section>
      <Footer currentUser={currentUser} handleLogout={handleLogout} />
    </>
  )
}
