import { useAuth } from './AuthContext'

export function useRequireAuth() {
  const { user } = useAuth()

  const requireAuth = (action) => {
    if (!user) {
      const currentPath = window.location.pathname
      window.location.href = `/login?redirect=${currentPath}`
      return
    }
    action()
  }

  return { requireAuth, user }
}