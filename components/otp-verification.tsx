"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verifyOtp } from "@/lib/api/auth";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { NextRequest } from "next/server";

export function OtpVerification({
  className,
  ...props
}: React.ComponentProps<"div">, req: NextRequest) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const otpString = otp.join("");

    const userDetails = JSON.parse(localStorage.getItem("userData") || "null");

    if (!userDetails.email || !userDetails.accessToken) {
      console.error("Email or access token not found in localStorage");
      console.log(userDetails);
      return;
    }

    try {
      const result = await verifyOtp(userDetails.email, otpString);
      if (result.success) {
        localStorage.removeItem("userData");
        toast.success("OTP verified successfully!");
        router.push("/login");
      } else {
        console.error("OTP verification failed:", result.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "OTP Verification failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
                <p className="text-balance text-muted-foreground">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
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
              {isLoading ? (
                  <Button className="w-full bg-[#FF6B35] text-white" disabled>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying OTP
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-[#FF6B35] text-white"
                  >
                    Verify OTP
                  </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
