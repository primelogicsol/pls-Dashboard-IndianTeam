"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from "react-toastify"
import { motion, HTMLMotionProps } from 'framer-motion';
import { sendOtp, verifyOtp, updatePassword, forgotPasswordVerifyOtp } from "@/lib/api/auth"

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}


export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [newPassword, setNewPassword] = useState("")
  const [step, setStep] = useState<"email" | "otp" | "reset">("email")
  const [uid, setUid] = useState<string | null>(null)

  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (step === "email") {
        await sendOtp(email)
        toast.success("OTP sent successfully.")
        setStep("otp")
      } else if (step === "otp") {
        const response = await forgotPasswordVerifyOtp(otp.join(""))
        
        if (response?.data?.uid) {
          setUid(response.data.uid) // Store UID
        }
        toast.success("OTP verified successfully.")
        setStep("reset")
      } else if (step === "reset") {
        if (!uid) {
          toast.error("UID is missing. Please restart the process.")
          return
        }
        await updatePassword(newPassword, uid)
        toast.success("Password updated successfully.")
        router.push("/login")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
    }

    setIsLoading(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== "" && index < 5) {
        otpInputRefs.current[index + 1]?.focus()
      } else if (value === "" && index > 0) {
        otpInputRefs.current[index - 1]?.focus()
      }
    }
  }

  return (
    <motion.div>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid gap-4">
          {step === "email" && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          {step === "otp" && (
            <div className="grid gap-4">
              <Label htmlFor="otp">Enter OTP</Label>
              <div className="flex justify-between">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    ref={(el) => {
                      otpInputRefs.current[index] = el
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {step === "reset" && (
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                placeholder="Enter your new password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
        <Button disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Reset Password"}
        </Button>
      </form>
      <ToastContainer />
    </motion.div>
  )
}
