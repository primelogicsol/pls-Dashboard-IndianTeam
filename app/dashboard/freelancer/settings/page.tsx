"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getUserDetails } from "@/lib/api/storage";
import {
  sendOtp,
  sendOtpForVerifyingUser,
  updateUserEmail,
  updateUserInfo,
  verifyEmail,
} from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

const profileFormSchema = z.object({
  username: z.string().min(4, { message: "Username must be at least 4 characters." }),
  fullName: z.string().min(4, { message: "Full Name must be at least 4 characters." }),
});

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  otp: z.string().optional(),
});

export default function FreelancerSettingsPage() {
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [email, setEmail] = useState("");
  const { isAuthorized } = useAuth(["FREELANCER"]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { username: "", fullName: "" },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "", otp: "" },
  });

  async function onProfileSubmit(data: { username: string; fullName: string }) {
    try {
      await updateUserInfo(data.username, data.fullName);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      profileForm.setError("username", {
        type: "manual",
        message: error?.response?.data?.details?.[0]?.message || "An error occurred while updating profile.",
      });
    }
  }

  async function onEmailSubmit(values: { email: string }) {
    try {
      await updateUserEmail(values.email);
      await sendOtpForVerifyingUser(values.email);
      setEmail(values.email);
      setShowOtpSection(true);
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      emailForm.setError("email", {
        type: "manual",
        message: error?.response?.data?.details?.[0]?.message || "An error occurred while updating email.",
      });
    }
  }

  async function onOtpSubmit(values: { email: string; otp?: string }) {
    if (!values.otp || values.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await verifyEmail(email, values.otp);
      if (response.success) {
        toast.success("Email verified successfully!");
        setShowOtpSection(false);
      }
    } catch (error: any) {
      toast.error(error?.error || "OTP verification failed.");
    }
  }

  if(!isAuthorized) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* <h1 className="text-3xl font-bold">Settings</h1> */}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Update Your Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="button" onClick={profileForm.handleSubmit(onProfileSubmit)}>
                Update Info
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Update Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={showOtpSection} placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={emailForm.handleSubmit(onEmailSubmit)} disabled={showOtpSection}>
                Update Email
              </Button>
            </form>
            {showOtpSection && (
              <>
                <FormField
                  control={emailForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" maxLength={6} placeholder="Enter OTP" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mt-4 w-full" onClick={emailForm.handleSubmit(onOtpSubmit)}>
                  Verify Your Email
                </Button>
              </>
            )}
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
