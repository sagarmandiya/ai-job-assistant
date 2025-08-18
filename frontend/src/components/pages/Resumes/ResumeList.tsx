import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download, Trash2, Calendar, FileIcon, AlertCircle } from "lucide-react";

interface Resume {
  id: string;
  name: string;
  originalName: string;
  uploadDate: string;
  size: string;
  status: "analyzed" | "processing" | "error";
  chunksIndexed?: number;
  createdAt: Date;
  filePath?: string;
}

interface ResumeListProps {
  resumes: Resume[];
  onViewResume: (resume: Resume) => void;
  onDeleteResume: (resume: Resume) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "analyzed":
      return FileText;
    case "processing":
      return FileText;
    case "error":
      return AlertCircle;
    default:
      return FileIcon;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "analyzed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export function ResumeList({
  resumes,
  onViewResume,
  onDeleteResume
}: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No resumes uploaded yet</h3>
          <p className="text-muted-foreground">
            Upload your first resume to get started with AI-powered analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => {
        const StatusIcon = getStatusIcon(resume.status);
        return (
          <Card key={resume.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{resume.originalName}</h3>
                      <Badge className={getStatusColor(resume.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {resume.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{resume.size}</span>
                      <span>•</span>
                      <span>{resume.uploadDate}</span>
                      {resume.chunksIndexed && (
                        <>
                          <span>•</span>
                          <span>{resume.chunksIndexed} chunks indexed</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Uploaded {formatDate(resume.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewResume(resume)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteResume(resume)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
