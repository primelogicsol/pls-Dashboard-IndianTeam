"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import LogInImg from "@/assets/loginImg.png";
import PLSLogo from "@/assets/pls_logo.jpg";
import { login } from "@/lib/api/auth"; // Import login function
import { setUserDetails } from "@/lib/api/storage"; // Store user in cookies
import { UserRole } from "@/lib/api/userDetailsEnum"; // User role enum
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await login(username, password);

      if (response) {

        // const hardCodeEmail = response.data.username === "junaidkhan123"
        setUserDetails(response); // Store user in cookies

        switch (response.role) {
          case UserRole.ADMIN:
            router.push("dashboard/Administrator");
            break;
          case UserRole.MODERATOR:
            router.push("dashboard/Administrator");
            break;
          case UserRole.FREELANCER:
            router.push("dashboard/freelancer");
            break;
          case UserRole.CLIENT:
            router.push("dashboard/client");
            break;
          default:
            router.push("/");
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Please try again later";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <div
            className="relative hidden bg-[#003087] border-r-2 md:block hover:cursor-pointer"
            style={{ borderRight: "2px solid orange" }}
            onClick={() => router.push("https://primelogicsol.com")}
          >
            <Image
              src={PLSLogo}
              className="absolute p-8 inset-0 h-full w-full object-cover"
              width={600}
              height={600}
              alt="login Image"
            />
          </div>
          <div className="bg-[#003087]">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl text-white font-bold">
                    Welcome back
                  </h1>
                  <p className="text-balance text-white">
                    Login to your PLS account
                  </p>
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center text-white">
                    <Label htmlFor="password">Password</Label>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/forgot-password");
                      }}
                      className="ml-auto text-sm underline-offset-2 cursor-pointer hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {isLoading ? (
                  <Button className="w-full bg-[#FF6B35] text-white" disabled>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Signing in
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-[#FF6B35] text-white"
                  >
                    Sign In
                  </Button>
                )}
                <div className="text-center text-white text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/register");
                    }}
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="https://primelogicsol.com/terms-and-conditions" target="_blank" className="hover:text-[#003087]">
          Terms of Service
        </Link>{" "}
        and{" "}
        <a href="https://primelogicsol.com/privacy-policy" target="_blank" className="hover:text-[#003087]">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
