import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Upload, Loader2, AlertCircle, FileIcon } from "lucide-react";

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: File | null;
  isUploading: boolean;
  onUpload: () => void;
  onCancel: () => void;
  formatFileSize: (bytes: number) => string;
}

export default function UploadDialog({ 
  isOpen, 
  onOpenChange, 
  selectedFile, 
  isUploading, 
  onUpload, 
  onCancel,
  formatFileSize 
}: UploadDialogProps) {
  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
      return <FileIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-primary" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Confirm upload of the selected resume file
          </DialogDescription>
        </DialogHeader>
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              {getFileIcon(selectedFile.name)}
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>This will:</span>
              </div>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Extract text from your resume</li>
                <li>Create searchable chunks for AI generation</li>
                <li>Store the resume for future use</li>
              </ul>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}