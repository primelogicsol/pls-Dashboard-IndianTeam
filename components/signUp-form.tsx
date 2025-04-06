"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignUpImg from "@/assets/pls_logo.jpg"
import Image from "next/image";
import { registerUser } from "@/lib/api/auth";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser({ username, fullName, email, password });
      console.log("Signup successful:", response);
      router.push("/verify-otp"); // Redirect on success
    } catch (error) {
      if (error instanceof Error) {
        console.error("Signup error:", error.message);
      } else {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 bg-[#003087]">
          <form className="p-6 md:p-8 border-r-2" style={{borderRight: "2px solid orange"}} onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl text-white font-bold">Create an account</h1>
                <p className="text-balance text-white">
                  Sign up for your PLS account
                </p>
              </div>
              <div className="grid gap-2 text-white">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2 text-white">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2 text-white">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 text-white">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-[#FF6B35] text-white">
                Sign Up
              </Button>
              <div className="text-center text-white text-sm">
                Already have an account?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                >
                  Log in
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-[#003087] md:block">
            <Image
              src={SignUpImg}
              className="absolute inset-0 p-8 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
              width={600}
              height={600}
              alt="login Image"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
