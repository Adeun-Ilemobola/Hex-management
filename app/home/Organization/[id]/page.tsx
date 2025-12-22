"use client";
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, UserPlus, Building, Mail, Clock } from "lucide-react";
import { OrganizationInfoFull } from '@/lib/ZodObject';

// --- Types ---

// Extended Member type to include UI-necessary fields (Name/Email)
// typically resolved from the userId relation in a real DB


// --- Mock Data ---

const initialOrgData: OrganizationInfoFull = {
  id: "org_123",
  name: "Acme Corp",
  slug: "acme-corp",
  createdAt: new Date("2023-01-15"),
  logo: null,
  metadata: {}, 
  members: [
    {
      id: "mem_1",
      organizationId: "org_123",
      userId: "user_1",
      name: "Alice Johnson",
      email: "alice@acme.com",
      role: "Admin",
      createdAt: new Date("2023-01-16"),
    },
    {
      id: "mem_2",
      organizationId: "org_123",
      userId: "user_2",
      name: "Bob Smith",
      email: "bob@acme.com",
      role: "Member",
      createdAt: new Date("2023-02-20"),
    },
    {
      id: "mem_3",
      organizationId: "org_123",
      userId: "user_3",
      name: "Charlie Brown",
      email: "charlie@acme.com",
      role: "Viewer",
      createdAt: new Date("2023-03-10"),
    },
  ],
  invitations: [
    {
      id: "inv_1",
      organizationId: "org_123",
      email: "david.waiting@gmail.com",
      role: "Member",
      status: "pending",
      inviterId: "user_1",
      expiresAt: new Date("2024-12-30"),
      createdAt: new Date("2024-12-01"),
      teamId: null,
    },
    {
      id: "inv_2",
      organizationId: "org_123",
      email: "sarah.pending@outlook.com",
      role: "Viewer",
      status: "pending",
      inviterId: "user_1",
      expiresAt: new Date("2024-12-31"),
      createdAt: new Date("2024-12-05"),
      teamId: null,
    },
  ],
};

// --- Main Component ---

export default  function page( ) {
    
  const [orgData, setOrgData] = useState<OrganizationInfoFull>(initialOrgData);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter members based on search query (Name or Email)
  const filteredMembers = orgData.members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* 1. Organization Info Object A */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={orgData.logo || ""} alt={orgData.name} />
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {orgData.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{orgData.name}</CardTitle>
            <CardDescription className="text-muted-foreground flex items-center gap-2 mt-1">
              <span className="font-mono bg-muted px-1 rounded text-xs">@{orgData.slug}</span>
              <span>•</span>
              <span className="text-xs">Est. {orgData.createdAt.getFullYear()}</span>
            </CardDescription>
          </div>
          
          {/* Placeholder: Toggle Organizations Button */}
          <Button variant="outline" className="ml-auto" onClick={() => console.log("TODO: Toggle Org Logic")}>
            <Building className="mr-2 h-4 w-4" />
            Switch Organization
          </Button>
        </CardHeader>
      </Card>

      {/* 2. Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Team Members</h2>
          
          {/* Placeholder: Add Member Button */}
          <Button onClick={() => console.log("TODO: Add Member Logic")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Search System */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members by name or email..."
            className="pl-8 max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Members List */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {member.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator />

      {/* 3. Pending Invitations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-muted-foreground">
          Pending Invitations
        </h2>
        
        <div className="border rounded-md bg-muted/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgData.invitations.filter(i => i.status === 'pending').length > 0 ? (
                orgData.invitations
                  .filter((inv) => inv.status === "pending")
                  .map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {invitation.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invitation.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invitation.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 text-yellow-600 text-sm font-medium">
                          <Clock className="h-3 w-3" />
                          Pending
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No pending invitations.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}