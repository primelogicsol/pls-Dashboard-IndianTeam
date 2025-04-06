"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FreelancerRequests from "@/components/freelancers/FreelancerRequests";
import AllFreelancers from "@/components/freelancers/AllFreelancers";
import { useAuth } from "@/hooks/useAuth";

export default function FreelancersPage() {
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);
  if(!isAuthorized) return null;
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="requests">
        <TabsList className="flex justify-start space-x-4">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="freelancers">All Freelancers</TabsTrigger>
        </TabsList>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <FreelancerRequests />
        </TabsContent>

        {/* All Freelancers Tab */}
        <TabsContent value="freelancers">
          <AllFreelancers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
