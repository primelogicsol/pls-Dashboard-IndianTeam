import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OtpVerificationProps {
  onSubmit: (otp: string) => void
}

export function OtpVerification({ onSubmit }: OtpVerificationProps) {
  const [otp, setOtp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(otp)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Verify OTP</CardTitle>
        <CardDescription>Please check your email for the OTP.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Verify</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

