"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AcceptFreeLancerRequests,
  getAllFreelancersRequest,
  TrashAFreeLancer,
} from "@/lib/api/freelancers";
import { Data } from "@/types/freelancers";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function FreelancerRequests() {
  const [requests, setRequests] = useState<Data[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Data | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  useEffect(() => {
    fetchFreelancerRequests();
  }, []);

  const fetchFreelancerRequests = async () => {
    try {
      const response = await getAllFreelancersRequest();
        
      if (response?.data && Array.isArray(response.data)) {
        setRequests(response.data as Data[]);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };
  // 🔒 Guard against `null`
  if (!requests) return <div>Loading or failed to fetch requests.</div>;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleTrash = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: "Trashing..." }));
    try {
      const response = await TrashAFreeLancer(id);
      if (response.status === 200) {
        setRequests((prev) => prev.filter((request) => String(request?.id) !== String(id)));
        toast.success("Freelancer Request Trashed Successfully");
      }
    } catch (error) {
      console.error("Error trashing request:", error);
      toast.error("Failed to trash request");
    }
    setLoading((prev) => ({ ...prev, [id]: undefined }));
  };

  const acceptFreelancer = async (id: string) => {
    console.log(id);

    if (!id ) {
      toast.error("Invalid freelancer ID. Please try again.");
      return
    }
    setLoading((prev) => ({ ...prev, [id]: "Accepting..." }));
    try {
      const response = await AcceptFreeLancerRequests(id);
      if (response.status === 200) {
        toast.success("Freelancer accepted successfully");
        setRequests((prev) => prev.filter((request) => String(request?.id) !== String(id)));
      }
    } catch (error) {
      console.error("Error accepting freelancer:", error);
      toast.error("Failed to accept freelancer");
    }
    setLoading((prev) => ({ ...prev, [id]: undefined }));
  };

  const filteredRequests = (requests || []).filter(
    (request) =>
      request?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.whoYouAre?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.whoYouAre?.phone.includes(searchTerm) ||
      request?.whoYouAre?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRequests.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        {/* <Input
          type="text"
          placeholder="Search..."
          className="w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        /> */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search freelancers..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select onValueChange={handleEntriesChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Entries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.length > 0 ? (
            currentEntries.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request?.whoYouAre?.fullName}</TableCell>
                <TableCell>{request?.whoYouAre?.email}</TableCell>
                <TableCell>{request?.whoYouAre?.phone}</TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                      </DialogHeader>
                      {selectedRequest && (
                        <div className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-2">
                          <p><strong>Name:</strong> {selectedRequest.whoYouAre?.fullName}</p>
                          <p><strong>Email:</strong> {selectedRequest.whoYouAre?.email}</p>
                          <p><strong>Phone:</strong> {selectedRequest.whoYouAre?.phone || "N/A"}</p>
                          <p><strong>Country:</strong> {selectedRequest.whoYouAre?.country || "N/A"}</p>
                          <p><strong>Time Zone:</strong> {selectedRequest.whoYouAre?.timeZone || "N/A"}</p>
                          <div>
                            <strong>Professional Links:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.whoYouAre?.professionalLinks && Object.entries(selectedRequest.whoYouAre.professionalLinks).map(([key, value]) => (
                                <li key={key}><strong>{key}:</strong> <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500">{value}</a></li>
                              ))}
                            </ul>
                          </div>
                          <p><strong>Primary Domain:</strong> {selectedRequest.coreRole?.primaryDomain}</p>
                          <div>
                            <strong>Elite Skills:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.eliteSkillCards?.selectedSkills?.map((skill: string) => (
                                <li key={skill}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Toolstack Proficiency:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.toolstackProficiency?.selectedTools?.map((toolcat: any, idx: number) => (
                                <li key={idx}><strong>{toolcat.category}:</strong> {toolcat.tools.join(", ")}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Domain Experience:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.domainExperience?.roles?.map((role: any, idx: number) => (
                                <li key={idx}>{role.title} ({role.years} years)</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Industry Experience:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.industryExperience?.selectedIndustries?.map((industry: string) => (
                                <li key={industry}>{industry}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Availability:</strong>
                            <ul className="ml-4 list-disc">
                              <li><strong>Weekly Commitment:</strong> {selectedRequest.availabilityWorkflow?.weeklyCommitment} hrs</li>
                              <li><strong>Working Hours:</strong> {selectedRequest.availabilityWorkflow?.workingHours?.join(", ")}</li>
                              <li><strong>Collaboration Tools:</strong> {selectedRequest.availabilityWorkflow?.collaborationTools?.join(", ")}</li>
                              <li><strong>Team Style:</strong> {selectedRequest.availabilityWorkflow?.teamStyle}</li>
                              <li><strong>Screen Sharing:</strong> {selectedRequest.availabilityWorkflow?.screenSharing}</li>
                              <li><strong>Exceptions:</strong> {selectedRequest.availabilityWorkflow?.availabilityExceptions || "None"}</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Soft Skills:</strong>
                            <ul className="ml-4 list-disc">
                              <li><strong>Collaboration Style:</strong> {selectedRequest.softSkills?.collaborationStyle}</li>
                              <li><strong>Communication Frequency:</strong> {selectedRequest.softSkills?.communicationFrequency}</li>
                              <li><strong>Conflict Resolution:</strong> {selectedRequest.softSkills?.conflictResolution}</li>
                              <li><strong>Languages:</strong> {selectedRequest.softSkills?.languages?.join(", ")}</li>
                              <li><strong>Team vs Solo:</strong> {selectedRequest.softSkills?.teamVsSolo}</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Certifications:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.certifications?.certificates?.map((cert: any, idx: number) => (
                                <li key={idx}><a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{cert.name}</a></li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Project Quoting:</strong>
                            <ul className="ml-4 list-disc">
                              <li><strong>Compensation Preference:</strong> {selectedRequest.projectQuoting?.compensationPreference}</li>
                              <li><strong>Small Project Price:</strong> ${selectedRequest.projectQuoting?.smallProjectPrice}</li>
                              <li><strong>Mid Project Price:</strong> ${selectedRequest.projectQuoting?.midProjectPrice}</li>
                              <li><strong>Long Term Price:</strong> ${selectedRequest.projectQuoting?.longTermPrice}</li>
                              <li><strong>Milestone Terms:</strong> {selectedRequest.projectQuoting?.milestoneTerms}</li>
                              <li><strong>Will Submit Proposals:</strong> {selectedRequest.projectQuoting?.willSubmitProposals}</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Legal Agreements:</strong>
                            <ul className="ml-4 list-disc">
                              {selectedRequest.legalAgreements?.agreements?.map((agreement: any) => (
                                console.log(agreement),

                                <li key={agreement.id}><strong>{agreement.id}:</strong> {agreement.accepted ? "Accepted" : "Not Accepted"}</li>
                              ))}
                              <li><strong>Work Authorization ID:</strong> {selectedRequest.legalAgreements?.workAuthorizationId}</li>
                            </ul>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="mt-4"
                            onClick={() => acceptFreelancer((selectedRequest?.id))}
                            disabled={!!loading[(selectedRequest?.id)]}
                          >
                            {loading[(selectedRequest?.id)] || "Accept Freelancer"}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleTrash(Number(request.id))}
                    disabled={!!loading[Number(request.id)]}
                  >
                    {loading[Number(request.id)] || "Trash"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
