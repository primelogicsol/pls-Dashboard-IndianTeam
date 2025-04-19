"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignUpImg from "@/assets/pls_logo.jpg";
import Image from "next/image";
import { registerUser } from "@/lib/api/auth";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const signupSchema = z.object({
  username: z.string().min(3, "Username is required"),
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  country: z.string().min(1, "Country is required"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await registerUser(data);
      toast.success("Registration successful! Please check your email for the OTP.");
      router.push("/verify-otp");
    } catch (error: any) {
      const response = error?.response?.data;

      const detailedMessage = error?.details?.[0]?.message;
      const generalMessage = response?.message || response?.error || error?.message || "Something went wrong, please try again.";

      const finalMessage = detailedMessage || generalMessage;
      setServerError(finalMessage);
      toast.error(finalMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 bg-[#003087]">
          <form
            className="p-6 md:p-8 border-r-2"
            style={{ borderRight: "2px solid orange" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl text-white font-bold">Create an account</h1>
                <p className="text-balance text-white">Sign up for your PLS account</p>
              </div>

              {serverError && <p className="text-red-500 text-center">{serverError}</p>}

              <div className="grid gap-2">
                <Label className="text-white" htmlFor="username">
                  Username
                </Label>
                <Input id="username" type="text" placeholder="johndoe" {...register("username")} />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label className="text-white" htmlFor="fullName">
                  Full Name
                </Label>
                <Input id="fullName" type="text" placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label className="text-white" htmlFor="email">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country" className="text-white">
                  Country
                </Label>
                <Input id="country" type="text" placeholder="Enter your Country" {...register("country")} />
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
              </div>

              {isLoading ? (
                <Button className="w-full bg-[#FF6B35] text-white" disabled>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Signing Up
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-[#FF6B35] text-white">
                  Sign Up
                </Button>
              )}

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
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
