"use client";

import { useEffect, useState } from "react";

// Define mobile width limit
const MOBILE_BREAKPOINT = 768; 

export default function MobileRestriction({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize(); // Check initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-center p-4">
        <div className="max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">🚫 Mobile Access Restricted</h2>
          <p className="mt-2 text-gray-600">
            Please use a **laptop or tablet** for a better experience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
