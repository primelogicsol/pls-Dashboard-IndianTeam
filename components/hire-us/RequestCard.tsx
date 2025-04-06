import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  Trash2,
  Mail,
  Phone,
  Building,
  MapPin,
  Info,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";

interface Document {
  url: string;
  name: string;
}

interface HireUsRequest {
  isDeleting?: boolean;
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  detail: string;
  docs: Document[];
  createdAt: string;
  trashedBy: string | null;
  trashedAt: string | null;
}

export default function RequestCard({
  request,
  onTrash,
  formatDate,
}: {
  request: HireUsRequest;
  onTrash: (id: number) => void;
  formatDate: (date: string) => string;
}) {
  const [selectedDocument, setSelectedDocument] = useState<string>(
    request.docs.length > 0 ? request.docs[0].url : ""
  ); 

  const [loading, setLoading] = useState<boolean>(true);

  // Automatically stop loading after 3 seconds in case onLoad is blocked
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, [selectedDocument]);

  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="bg-blue-100">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{request.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submitted on {formatDate(request.createdAt)}
            </p>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onTrash(request.id)}
            disabled={request.isDeleting} 
          >
            {request.isDeleting ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Trash2 size={18} /> 
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground" size={18} />
              <span>{request.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground" size={18} />
              <span>{request.phone}</span>
            </div>
            {request.company && (
              <div className="flex items-center gap-2">
                <Building className="text-muted-foreground" size={18} />
                <span>{request.company}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground" size={18} />
              <span>{request.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Info className="text-muted-foreground mt-1" size={18} />
              <span>{request.detail}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">
              Documents ({request.docs.length})
            </h3>
            {request.docs.length > 0 ? (
              <Tabs
                defaultValue={selectedDocument}
                onValueChange={(val) => {
                  setSelectedDocument(val);
                  setLoading(true);
                }}
              >
                <TabsList className="mb-4 flex flex-wrap h-auto">
                  {request.docs.map((doc) => (
                    <TabsTrigger
                      key={doc.url}
                      value={doc.url}
                      className="flex items-center gap-1"
                    >
                      <FileText size={14} />
                      <span className="truncate max-w-[100px]">{doc.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent
                  key={selectedDocument}
                  value={selectedDocument}
                  className="h-[400px] border rounded-md flex justify-center items-center"
                >
                  {loading && (
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                  )}
                  {!loading && (
                    <iframe
                      key={selectedDocument} 
                      src={`${selectedDocument}#toolbar=0`}
                      className="w-full h-full"
                      title={selectedDocument}
                      loading="lazy"
                      onLoad={() => setLoading(false)}
                    />
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-muted-foreground">
                No documents available
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 flex justify-end">
        <div className="flex flex-wrap gap-2">
          {request.docs.map((doc) => (
            <a
              key={doc.url}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <FileText size={14} />
              {doc.name}
            </a>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
