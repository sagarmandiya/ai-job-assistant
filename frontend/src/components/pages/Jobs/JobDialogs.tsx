import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Building, Loader2 } from "lucide-react";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  description: string;
  savedDate: string;
  createdAt: Date;
}

interface JobDialogsProps {
  selectedJob: SavedJob | null;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  editTitle: string;
  editCompany: string;
  editDescription: string;
  onCloseViewDialog: () => void;
  onCloseEditDialog: () => void;
  onCloseDeleteDialog: () => void;
  onEditTitleChange: (value: string) => void;
  onEditCompanyChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onConfirmEdit: () => void;
  onConfirmDelete: () => void;
}

export function JobDialogs({
  selectedJob,
  isViewDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isUpdating,
  isDeleting,
  editTitle,
  editCompany,
  editDescription,
  onCloseViewDialog,
  onCloseEditDialog,
  onCloseDeleteDialog,
  onEditTitleChange,
  onEditCompanyChange,
  onEditDescriptionChange,
  onConfirmEdit,
  onConfirmDelete
}: JobDialogsProps) {
  if (!selectedJob) return null;

  return (
    <>
      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onCloseViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <DialogTitle>{selectedJob.title}</DialogTitle>
              <Badge variant="secondary">
                {selectedJob.savedDate}
              </Badge>
            </div>
            <DialogDescription>
              Job description details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Company</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedJob.company}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Saved Date</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedJob.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <Label className="text-sm font-medium">Job Description</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                {selectedJob.description}
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

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onCloseEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Job Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => onEditTitleChange(e.target.value)}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editCompany}
                  onChange={(e) => onEditCompanyChange(e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Job Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => onEditDescriptionChange(e.target.value)}
                placeholder="Job description"
                rows={12}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editDescription.length} characters
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseEditDialog} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={onConfirmEdit} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Job Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedJob.title}" at {selectedJob.company}? This action cannot be undone.
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
