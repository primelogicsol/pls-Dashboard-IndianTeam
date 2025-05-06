"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/trash-management/UsersTable"; // Import UsersTable component
import ContactUsTable from "@/components/trash-management/ContactUsTable";
import QuotesTable from "@/components/trash-management/QuotesTable";
import { useAuth } from "@/hooks/useAuth";
import ConsultationsTable from "@/components/trash-management/ConsultationsTable";
import HireUsTable from "@/components/trash-management/HireUsTable";
import { AlertTriangle } from "lucide-react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");
  const { isAuthorized } = useAuth(["ADMIN"]);
  if (!isAuthorized) return null;

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Navigation */}
        <TabsList className="flex space-x-4 bg-gray-100 p-2 rounded-md">
          <TabsTrigger value="freelancerRequests">
            Freelancer Requests
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="hireUs">Project Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="freelancerRequests">
          <Card className="mt-4 text-center py-10">
            <CardHeader>
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
                <CardTitle className="text-xl">API Not Configured</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                There is no backend API configured to fetch the trashed freelancer requests list.
                Please contact your developer or refer to the documentation to
                set up the required endpoint.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab - Render UsersTable Component */}
        <TabsContent value="users">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Contact Us Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactUsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <QuotesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations">
          <Card className="mt-4">
            <CardContent>
              <ConsultationsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hireUs">
          <Card className="mt-4">
            <CardContent>
              <HireUsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
