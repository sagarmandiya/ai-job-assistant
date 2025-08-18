import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, FileIcon } from "lucide-react";
import { Resume } from "@/hooks/useResumeManagement";

interface ResumeViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume | null;
  onUseForGeneration: (resume: Resume) => void;
}

export default function ResumeViewDialog({ isOpen, onOpenChange, resume, onUseForGeneration }: ResumeViewDialogProps) {
  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
      return <FileIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-primary" />;
  };

  if (!resume) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon(resume.originalName)}
            {resume.name}
          </DialogTitle>
          <DialogDescription>
            Resume details and information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <span className="text-sm font-medium">File Name:</span>
              <p className="text-sm text-muted-foreground">{resume.originalName}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Upload Date:</span>
              <p className="text-sm text-muted-foreground">{resume.uploadDate}</p>
            </div>
            <div>
              <span className="text-sm font-medium">File Size:</span>
              <p className="text-sm text-muted-foreground">{resume.size}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Status:</span>
              <p className={`text-sm font-medium ${
                resume.status === "analyzed" ? "text-green-600" : 
                resume.status === "processing" ? "text-yellow-600" : "text-red-600"
              }`}>
                {resume.status}
              </p>
            </div>
            {resume.chunksIndexed && (
              <div className="col-span-2">
                <span className="text-sm font-medium">Chunks Indexed:</span>
                <p className="text-sm text-muted-foreground">{resume.chunksIndexed} text segments</p>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>This resume has been processed and is available for AI-powered content generation.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => {
            onUseForGeneration(resume);
            onOpenChange(false);
          }}>
            Use for Generation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}