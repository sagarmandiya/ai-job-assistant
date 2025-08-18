import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ResumeUpload } from "@/components/pages/Resumes/ResumeUpload";
import { ResumeList } from "@/components/pages/Resumes/ResumeList";
import { ResumeDialogs } from "@/components/pages/Resumes/ResumeDialogs";
import { useResumes } from "@/hooks/use-resumes";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ResumesPage() {
  const {
    resumes,
    isLoading,
    isUploading,
    selectedFile,
    isUploadDialogOpen,
    selectedResume,
    isViewDialogOpen,
    isDeleteDialogOpen,
    isDeleting,
    handleFileSelect,
    handleUploadResume,
    handleViewResume,
    handleDeleteResume,
    handleConfirmDelete,
    setIsUploadDialogOpen,
    setIsViewDialogOpen,
    setIsDeleteDialogOpen
  } = useResumes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
        <p className="text-muted-foreground">
          Upload and manage your resumes for AI-powered analysis and content generation
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumes Overview
          </CardTitle>
          <CardDescription>
            Your uploaded resumes and analysis status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{resumes.length}</div>
              <div className="text-sm text-muted-foreground">Total Resumes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {resumes.filter(resume => resume.status === "analyzed").length}
              </div>
              <div className="text-sm text-muted-foreground">Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {resumes.reduce((sum, resume) => sum + (resume.chunksIndexed || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Chunks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <ResumeUpload
        isUploadDialogOpen={isUploadDialogOpen}
        isUploading={isUploading}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onUpload={handleUploadResume}
        onCloseDialog={() => setIsUploadDialogOpen(false)}
      />

      {/* Resume List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Resumes</h2>
        <ResumeList
          resumes={resumes}
          onViewResume={handleViewResume}
          onDeleteResume={handleDeleteResume}
        />
      </div>

      {/* Dialogs */}
      <ResumeDialogs
        selectedResume={selectedResume}
        isViewDialogOpen={isViewDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onCloseViewDialog={() => setIsViewDialogOpen(false)}
        onCloseDeleteDialog={() => setIsDeleteDialogOpen(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
