import { UploadZone } from "@/components/pages/Upload/UploadZone";
import { UploadProgress } from "@/components/pages/Upload/UploadProgress";
import { ResumeList } from "@/components/pages/Upload/ResumeList";
import { useUpload } from "@/hooks/use-upload";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function UploadPage() {
  const {
    dragActive,
    uploading,
    currentUpload,
    uploadProgress,
    processingStages,
    currentStageIndex,
    overallProgress,
    uploadedResumes,
    uploadStats,
    selectedResume,
    isViewDialogOpen,
    isDeleteDialogOpen,
    isDeleting,
    setDragActive,
    handleFileUpload,
    handleViewResume,
    handleDeleteResume,
    handleConfirmDelete,
    onCloseViewDialog,
    onCloseDeleteDialog
  } = useUpload();

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumb className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Upload Resume</h1>
        <p className="text-muted-foreground">
          Upload your resume for AI-powered analysis and optimization
        </p>
      </div>

      {/* Upload Zone */}
      {!uploading && (
        <UploadZone
          onFileSelect={handleFileUpload}
          isUploading={uploading}
          dragActive={dragActive}
          setDragActive={setDragActive}
        />
      )}

      {/* Upload Progress */}
      {uploading && (
        <UploadProgress
          uploading={uploading}
          currentUpload={currentUpload}
          processingStages={processingStages}
          currentStageIndex={currentStageIndex}
          overallProgress={overallProgress}
          uploadProgress={uploadProgress}
        />
      )}

      {/* Resume List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Resumes</h2>
        <ResumeList
          uploadedResumes={uploadedResumes}
          selectedResume={selectedResume}
          isViewDialogOpen={isViewDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
          onViewResume={handleViewResume}
          onDeleteResume={handleDeleteResume}
          onCloseViewDialog={onCloseViewDialog}
          onCloseDeleteDialog={onCloseDeleteDialog}
          onConfirmDelete={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
