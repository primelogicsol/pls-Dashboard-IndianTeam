"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createQuote } from "@/lib/api/quotes";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const quoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  company: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  deadline: z.string().optional(),
  services: z.string().min(1, "Service is required"),
  detail: z.string().optional(),
});

export default function QuoteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  const onSubmit = async (data: z.infer<typeof quoteSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createQuote(data);
      if(response.status === 200) {
        toast.success("Quote has been successfully created");
      }
    } catch (error: any) {
      const errMsg =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "An error occurred while creating the quote."
          : error.request
          ? "No response from server. Please try again later."
          : "Something went wrong. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };
  if(!isAuthorized) return null;

  return (
    <div className="w-full h-full p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create a Quote</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input {...register("email")} type="email" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Phone</Label>
          <Input {...register("phone")} />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        <div>
          <Label>Company</Label>
          <Input {...register("company")} />
        </div>
        <div>
          <Label>Address</Label>
          <Input {...register("address")} />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>
        <div>
          <Label>Deadline</Label>
          <Input {...register("deadline")} type="date" />
        </div>
        <div>
          <Label>Services</Label>
          <Input {...register("services")} />
          {errors.services && <p className="text-red-500 text-sm">{errors.services.message}</p>}
        </div>
        <div className="col-span-2">
          <Label>Details</Label>
          <Textarea {...register("detail")} />
        </div>
        <div className="col-span-2 flex justify-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create Quote"}
          </Button>
        </div>
      </form>
      {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700">{error}</div>}
    </div>
  );
}
