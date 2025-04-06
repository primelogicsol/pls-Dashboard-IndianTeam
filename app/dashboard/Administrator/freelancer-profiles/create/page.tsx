"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const freelancerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  availability: z.object({
    status: z.enum(["Available", "Unavailable", "Part-time"]),
    weeks: z.number().min(0),
  }),
  experience: z.number().min(0),
  industries: z.array(z.string()),
  technologies: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    cloud: z.array(z.string()),
  }),
  certifications: z.array(z.string()),
})

const industryOptions = ["EdTech", "FinTech", "HealthTech", "E-commerce", "Social Media", "Travel"]
const technologyOptions = {
  frontend: ["React", "Vue.js", "Angular", "Svelte", "Next.js"],
  backend: ["Node.js", "Python", "Java", "Ruby", "Go"],
  database: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra"],
  cloud: ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Heroku"],
}
const certificationOptions = [
  "AWS Certified Developer",
  "Google Cloud Professional",
  "Microsoft Certified: Azure Developer",
  "Certified Kubernetes Administrator",
  "Certified Scrum Master",
]

export default function CreateFreelancerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof freelancerFormSchema>>({
    resolver: zodResolver(freelancerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      rating: 0,
      reviews: 0,
      availability: {
        status: "Available",
        weeks: 0,
      },
      experience: 0,
      industries: [],
      technologies: {
        frontend: [],
        backend: [],
        database: [],
        cloud: [],
      },
      certifications: [],
    },
  })

  async function onSubmit(values: z.infer<typeof freelancerFormSchema>) {
    setIsSubmitting(true)
    try {
      // Uncomment the following line to use the API
      // await createFreelancer(values)
      console.log(values)
      router.push("/dashboard/moderator/freelancer-profiles")
    } catch (error) {
      console.error("Failed to create freelancer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="mb-8 text-3xl font-bold">Create Freelancer Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Reviews</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability.status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability.weeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available in (weeks)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industries</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[field.value.length - 1]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industries" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Selected: {field.value.join(", ")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {Object.entries(technologyOptions).map(([category, options]) => (
            <FormField
              key={category}
              control={form.control}
              name={`technologies.${category}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{category.charAt(0).toUpperCase() + category.slice(1)} Technologies</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange([...field.value, value])}
                      value={field.value[field.value.length - 1]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${category} technologies`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((tech) => (
                          <SelectItem key={tech} value={tech}>
                            {tech}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Selected: {field.value.join(", ")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[field.value.length - 1]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select certifications" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificationOptions.map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Selected: {field.value.join(", ")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Freelancer Profile"}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}

/*
API Documentation:

1. Create Freelancer Profile
POST /api/freelancer-profiles
Request Body: FreelancerProfile
Response: {
  success: boolean
  data: FreelancerProfile
}
*/

