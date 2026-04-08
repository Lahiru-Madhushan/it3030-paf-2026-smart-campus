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
      <section className="bg-gradient-to-br from-white via-gray-50 to-yellow-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-8 rounded-3xl border border-yellow-100 bg-white/80 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Facilities and Assets
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Browse the smart campus catalogue
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              This catalogue is now served from the main project and uses the existing Campus Hub
              login session. You can explore resources, check QR summaries, review maintenance
              signals, and report issues without switching systems.
            </p>
          </div>
          <FacilitiesWorkspace />
        </div>
      </section>
      <Footer currentUser={currentUser} handleLogout={handleLogout} />
    </>
  )
}
