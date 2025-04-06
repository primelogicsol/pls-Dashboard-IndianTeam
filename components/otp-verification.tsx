"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { verifyOtp } from "@/lib/api/auth"
import axios from "axios"

export function OtpVerification({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const router = useRouter()

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
  
    const userDetails = JSON.parse(localStorage.getItem("userData") || "null");
    
  
    if (!userDetails.email || !userDetails.accessToken) {
      console.error("Email or access token not found in localStorage");
      return;
    }
  
    try {
      const result = await verifyOtp(userDetails.email, otpString, userDetails.accessToken); 
  
      if (result.success) {
        localStorage.removeItem("userData");
        
        console.log(result);
        router.push("/login");
      } else {
        console.error("OTP verification failed:", result.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw { message: "OTP verification failed" };
      }
    }
  };
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="text-balance text-muted-foreground">Enter the 6-digit code sent to your email</p>
              </div>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-12 text-center"
                  />
                ))}
              </div>
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

