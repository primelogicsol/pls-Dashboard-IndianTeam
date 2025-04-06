"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your reset password logic here
    // For now, we'll just redirect to the login page
    router.push("/login")
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter your new password</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative fade-in" style={{ animationDelay: "0.1s" }}>
              <Label htmlFor="password" className="sr-only">
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="New Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative fade-in" style={{ animationDelay: "0.2s" }}>
              <Label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Confirm New Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              type="submit"
              className="group relative flex w-full justify-center transition-all duration-300 hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Save className="h-5 w-5 text-gray-300 group-hover:text-gray-400" aria-hidden="true" />
              </span>
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

