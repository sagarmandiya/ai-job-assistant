import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, CheckCircle, AlertCircle, Eye, Trash2, Download, RefreshCw, Calendar, BarChart3, Clock } from "lucide-react";

interface UploadedResume {
  id: string;
  name: string;
  originalName: string;
  uploadDate: string;
  size: string;
  status: "processing" | "analyzed" | "error";
  chunksIndexed?: number;
  createdAt: Date;
  processingTime?: number;
  filePath?: string;
}

interface ResumeListProps {
  uploadedResumes: UploadedResume[];
  selectedResume: UploadedResume | null;
  isViewDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  onViewResume: (resume: UploadedResume) => void;
  onDeleteResume: (resume: UploadedResume) => void;
  onCloseViewDialog: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "analyzed":
      return CheckCircle;
    case "processing":
      return RefreshCw;
    case "error":
      return AlertCircle;
    default:
      return FileText;
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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function ResumeList({
  uploadedResumes,
  selectedResume,
  isViewDialogOpen,
  isDeleteDialogOpen,
  isDeleting,
  onViewResume,
  onDeleteResume,
  onCloseViewDialog,
  onCloseDeleteDialog,
  onConfirmDelete
}: ResumeListProps) {
  if (uploadedResumes.length === 0) {
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
    <>
      <div className="space-y-4">
        {uploadedResumes.map((resume) => {
          const StatusIcon = getStatusIcon(resume.status);
          return (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{resume.originalName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(resume.status)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {resume.status}
                    </Badge>
                    
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Resume Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onCloseViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resume Details</DialogTitle>
            <DialogDescription>
              Detailed information about the uploaded resume
            </DialogDescription>
          </DialogHeader>
          
          {selectedResume && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">File Name</label>
                  <p className="text-sm text-muted-foreground">{selectedResume.originalName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">File Size</label>
                  <p className="text-sm text-muted-foreground">{selectedResume.size}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Upload Date</label>
                  <p className="text-sm text-muted-foreground">{selectedResume.uploadDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedResume.status)}>
                    {selectedResume.status}
                  </Badge>
                </div>
                {selectedResume.chunksIndexed && (
                  <div>
                    <label className="text-sm font-medium">Chunks Indexed</label>
                    <p className="text-sm text-muted-foreground">{selectedResume.chunksIndexed}</p>
                  </div>
                )}
                {selectedResume.processingTime && (
                  <div>
                    <label className="text-sm font-medium">Processing Time</label>
                    <p className="text-sm text-muted-foreground">{selectedResume.processingTime}s</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDeleteDialog} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
