import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Calendar, Building, Loader2 } from "lucide-react";

interface GeneratedContent {
  id: string;
  type: "cover-letter" | "outreach-email";
  title: string;
  jobTitle: string;
  company: string;
  generatedDate: string;
  content: string;
  subjectLines?: string[];
  createdAt: Date;
  lastModified: Date;
}

interface LibraryDialogsProps {
  selectedContent: GeneratedContent | null;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  editTitle: string;
  editJobTitle: string;
  editCompany: string;
  editContent: string;
  onCloseViewDialog: () => void;
  onCloseEditDialog: () => void;
  onCloseDeleteDialog: () => void;
  onEditTitleChange: (value: string) => void;
  onEditJobTitleChange: (value: string) => void;
  onEditCompanyChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onConfirmEdit: () => void;
  onConfirmDelete: () => void;
}

const getContentIcon = (type: string) => {
  switch (type) {
    case "cover-letter":
      return FileText;
    case "outreach-email":
      return Mail;
    default:
      return FileText;
  }
};

const getContentColor = (type: string) => {
  switch (type) {
    case "cover-letter":
      return "bg-blue-100 text-blue-800";
    case "outreach-email":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function LibraryDialogs({
  selectedContent,
  isViewDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isUpdating,
  isDeleting,
  editTitle,
  editJobTitle,
  editCompany,
  editContent,
  onCloseViewDialog,
  onCloseEditDialog,
  onCloseDeleteDialog,
  onEditTitleChange,
  onEditJobTitleChange,
  onEditCompanyChange,
  onEditContentChange,
  onConfirmEdit,
  onConfirmDelete
}: LibraryDialogsProps) {
  if (!selectedContent) return null;

  const Icon = getContentIcon(selectedContent.type);

  return (
    <>
      {/* View Content Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onCloseViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <DialogTitle>{selectedContent.title}</DialogTitle>
              <Badge className={getContentColor(selectedContent.type)}>
                {selectedContent.type === "cover-letter" ? "Cover Letter" : "Outreach Email"}
              </Badge>
            </div>
            <DialogDescription>
              Generated on {selectedContent.generatedDate}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Content Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Company</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedContent.company}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Job Title</Label>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedContent.jobTitle}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedContent.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Modified</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedContent.lastModified.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Subject Lines (for emails) */}
            {selectedContent.subjectLines && selectedContent.subjectLines.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Subject Lines</Label>
                <div className="mt-2 space-y-2">
                  {selectedContent.subjectLines.map((subject, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      {subject}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <Label className="text-sm font-medium">Content</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                {selectedContent.content}
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

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onCloseEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Make changes to your generated content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => onEditTitleChange(e.target.value)}
                  placeholder="Content title"
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
              <div className="md:col-span-2">
                <Label htmlFor="edit-job-title">Job Title</Label>
                <Input
                  id="edit-job-title"
                  value={editJobTitle}
                  onChange={(e) => onEditJobTitleChange(e.target.value)}
                  placeholder="Job title"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => onEditContentChange(e.target.value)}
                placeholder="Content text"
                rows={15}
              />
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

      {/* Delete Content Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedContent.title}"? This action cannot be undone.
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
