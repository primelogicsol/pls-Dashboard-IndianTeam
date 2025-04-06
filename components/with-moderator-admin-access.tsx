"use client"

import type React from "react"

export function withModeratorAdminAccess<T>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => {
    // Commenting out access control logic
    /*
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
      const userRole = getUserRole()
      if (userRole === "moderator" || userRole === "admin") {
        setIsAuthorized(true)
      } else {
        router.push("/login") // Redirect to login page if not authorized
      }
    }, [router])

    if (!isAuthorized) {
      return null // Or a loading spinner
    }
    */

    // Directly render the component without access checks
    return <WrappedComponent {...props} />
  }
}

