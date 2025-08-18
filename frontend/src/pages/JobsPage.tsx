import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { JobForm } from "@/components/pages/Jobs/JobForm";
import { JobList } from "@/components/pages/Jobs/JobList";
import { JobDialogs } from "@/components/pages/Jobs/JobDialogs";
import { useJobs } from "@/hooks/use-jobs";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function JobsPage() {
  const {
    newJobTitle,
    newJobCompany,
    newJobDescription,
    isSubmitting,
    savedJobs,
    isLoading,
    selectedJob,
    isEditDialogOpen,
    isViewDialogOpen,
    isDeleteDialogOpen,
    editTitle,
    editCompany,
    editDescription,
    isUpdating,
    isDeleting,
    setNewJobTitle,
    setNewJobCompany,
    setNewJobDescription,
    handleSaveJob,
    handleViewJob,
    handleEditJob,
    handleDeleteJob,
    handleConfirmEdit,
    handleConfirmDelete,
    setIsEditDialogOpen,
    setIsViewDialogOpen,
    setIsDeleteDialogOpen,
    setEditTitle,
    setEditCompany,
    setEditDescription
  } = useJobs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Job Descriptions</h1>
        <p className="text-muted-foreground">
          Save and manage job descriptions for AI-powered analysis and content generation
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Jobs Overview
          </CardTitle>
          <CardDescription>
            Your saved job descriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{savedJobs.length}</div>
              <div className="text-sm text-muted-foreground">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {savedJobs.filter(job => job.title !== "Untitled Job").length}
              </div>
              <div className="text-sm text-muted-foreground">Titled Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {savedJobs.filter(job => job.company !== "Unknown Company").length}
              </div>
              <div className="text-sm text-muted-foreground">With Company</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Form */}
      <JobForm
        newJobTitle={newJobTitle}
        newJobCompany={newJobCompany}
        newJobDescription={newJobDescription}
        isSubmitting={isSubmitting}
        onTitleChange={setNewJobTitle}
        onCompanyChange={setNewJobCompany}
        onDescriptionChange={setNewJobDescription}
        onSubmit={handleSaveJob}
      />

      {/* Job List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Saved Jobs</h2>
        <JobList
          savedJobs={savedJobs}
          onViewJob={handleViewJob}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
        />
      </div>

      {/* Dialogs */}
      <JobDialogs
        selectedJob={selectedJob}
        isViewDialogOpen={isViewDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        editTitle={editTitle}
        editCompany={editCompany}
        editDescription={editDescription}
        onCloseViewDialog={() => setIsViewDialogOpen(false)}
        onCloseEditDialog={() => setIsEditDialogOpen(false)}
        onCloseDeleteDialog={() => setIsDeleteDialogOpen(false)}
        onEditTitleChange={setEditTitle}
        onEditCompanyChange={setEditCompany}
        onEditDescriptionChange={setEditDescription}
        onConfirmEdit={handleConfirmEdit}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
