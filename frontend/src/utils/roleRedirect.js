import { ROLES } from './constants'

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/dashboard/admin'
    case ROLES.TECHNICIAN:
      return '/dashboard/technician'
    case ROLES.USER:
    default:
      return '/dashboard/user'
  }
}
