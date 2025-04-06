import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserDetails } from "@/lib/api/storage";

export function useAuth(allowedRoles: string[]) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getUserDetails();

    if (!user) {
      router.push("/login");
      return; 
    }

    if (!allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
      return;
    }

    setIsAuthorized(true);
   
  }, [router, allowedRoles]);

  return { isAuthorized };
}
