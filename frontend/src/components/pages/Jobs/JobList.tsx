import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Eye, Edit, Trash2, Calendar, Building } from "lucide-react";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  description: string;
  savedDate: string;
  createdAt: Date;
}

interface JobListProps {
  savedJobs: SavedJob[];
  onViewJob: (job: SavedJob) => void;
  onEditJob: (job: SavedJob) => void;
  onDeleteJob: (job: SavedJob) => void;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export function JobList({
  savedJobs,
  onViewJob,
  onEditJob,
  onDeleteJob
}: JobListProps) {
  if (savedJobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No jobs saved yet</h3>
          <p className="text-muted-foreground">
            Add your first job description to get started with AI-powered analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedJobs.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium truncate max-w-[300px]" title={job.title}>
                      {job.title}
                    </h3>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {job.savedDate}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                    <div className="flex items-center gap-1 min-w-0">
                      <Building className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[150px]" title={job.company}>
                        {job.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                    {job.description.length > 150 
                      ? `${job.description.substring(0, 150)}...` 
                      : job.description
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewJob(job)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditJob(job)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteJob(job)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
