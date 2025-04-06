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

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");
  const { isAuthorized } = useAuth(["ADMIN"]);
  if (!isAuthorized) return null;

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        {/* Tabs Navigation */}
        <TabsList className="flex space-x-4 bg-gray-100 p-2 rounded-md">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="hireUs">Project Requests</TabsTrigger>
        </TabsList>

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
