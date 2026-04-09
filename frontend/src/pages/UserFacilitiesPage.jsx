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
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <FacilitiesWorkspace />
        </div>
      </section>
      <Footer currentUser={currentUser} handleLogout={handleLogout} />
    </>
  )
}
