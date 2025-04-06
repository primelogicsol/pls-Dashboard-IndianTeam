import { CheckCircle, Clock } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { format } from "date-fns";
import { TPROJECT } from "@/types/project";

interface FeedbackProps {
  project: TPROJECT | null;
}

export function Feedback({ project }: FeedbackProps) {
  return (
    <section className="mt-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Project Timeline & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="feedback">
            <TabsList className="mb-4">
              <TabsTrigger value="feedback">Client Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="feedback">
              {project && project.commentByClientAfterProjectCompletion ? (
                <div>
                  <p className="text-sm font-medium mb-2">Client Comment:</p>
                  <p className="text-sm">
                    {project.commentByClientAfterProjectCompletion}
                  </p>

                  {project.starsByClientAfterProjectCompletion && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Rating:</p>
                      <p className="text-sm">
                      <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} />
                        {project.starsByClientAfterProjectCompletion}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B"}} />
                  No feedback available yet. Feedback will be provided after
                  project completion.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
