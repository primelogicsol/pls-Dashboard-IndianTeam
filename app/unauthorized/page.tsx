"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Forbidden() {
  const router = useRouter();
  // Redirect to login page immediately
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}

