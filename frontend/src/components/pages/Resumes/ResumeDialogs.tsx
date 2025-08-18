import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Loader2 } from "lucide-react";

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

interface ResumeDialogsProps {
  selectedResume: Resume | null;
  isViewDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  onCloseViewDialog: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
}

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

export function ResumeDialogs({
  selectedResume,
  isViewDialogOpen,
  isDeleteDialogOpen,
  isDeleting,
  onCloseViewDialog,
  onCloseDeleteDialog,
  onConfirmDelete
}: ResumeDialogsProps) {
  if (!selectedResume) return null;

  return (
    <>
      {/* View Resume Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onCloseViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <DialogTitle>{selectedResume.originalName}</DialogTitle>
              <Badge className={getStatusColor(selectedResume.status)}>
                {selectedResume.status}
              </Badge>
            </div>
            <DialogDescription>
              Resume details and analysis information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">File Name</p>
                <p className="text-sm text-muted-foreground">{selectedResume.originalName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">File Size</p>
                <p className="text-sm text-muted-foreground">{selectedResume.size}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Upload Date</p>
                <p className="text-sm text-muted-foreground">{selectedResume.uploadDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className={getStatusColor(selectedResume.status)}>
                  {selectedResume.status}
                </Badge>
              </div>
              {selectedResume.chunksIndexed && (
                <div>
                  <p className="text-sm font-medium">Chunks Indexed</p>
                  <p className="text-sm text-muted-foreground">{selectedResume.chunksIndexed}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {selectedResume.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Resume Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedResume.originalName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDeleteDialog} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
