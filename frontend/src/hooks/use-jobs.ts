import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  description: string;
  savedDate: string;
  createdAt: Date;
}

export function useJobs() {
  const { toast } = useToast();
  
  // Form states
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Job management states
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit/View dialog states
  const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load saved jobs from localStorage on component mount
  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = () => {
    try {
      const stored = localStorage.getItem('careercraft-saved-jobs');
      if (stored) {
        const jobs = JSON.parse(stored).map((job: { id: string; title: string; company: string; description: string; savedDate: string; createdAt: string }) => ({
          ...job,
          createdAt: new Date(job.createdAt)
        }));
        setSavedJobs(jobs.sort((a: SavedJob, b: SavedJob) => b.createdAt.getTime() - a.createdAt.getTime()));
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const saveJobsToStorage = (jobs: SavedJob[]) => {
    try {
      localStorage.setItem('careercraft-saved-jobs', JSON.stringify(jobs));
    } catch (error) {
      console.error('Error saving jobs to storage:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!newJobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to backend vectorstore
      const response = await apiClient.setJobDescription(newJobDescription);
      
      if (response.error) {
        toast({
          title: "Backend Error",
          description: `Error saving to vectorstore: ${response.error}`,
          variant: "destructive",
        });
        return;
      }

      // Create new job object
      const newJob: SavedJob = {
        id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newJobTitle.trim() || "Untitled Job",
        company: newJobCompany.trim() || "Unknown Company",
        description: newJobDescription.trim(),
        savedDate: new Date().toLocaleDateString(),
        createdAt: new Date(),
      };

      // Add to local storage
      const updatedJobs = [newJob, ...savedJobs];
      setSavedJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);

      // Clear form
      setNewJobTitle("");
      setNewJobCompany("");
      setNewJobDescription("");

      toast({
        title: "Job Saved",
        description: "Job description has been saved successfully.",
      });

    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewJob = (job: SavedJob) => {
    setSelectedJob(job);
    setIsViewDialogOpen(true);
  };

  const handleEditJob = (job: SavedJob) => {
    setSelectedJob(job);
    setEditTitle(job.title);
    setEditCompany(job.company);
    setEditDescription(job.description);
    setIsEditDialogOpen(true);
  };

  const handleDeleteJob = (job: SavedJob) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (!selectedJob) return;

    setIsUpdating(true);
    
    try {
      const updatedJob: SavedJob = {
        ...selectedJob,
        title: editTitle.trim() || "Untitled Job",
        company: editCompany.trim() || "Unknown Company",
        description: editDescription.trim(),
      };

      const updatedJobs = savedJobs.map(job =>
        job.id === selectedJob.id ? updatedJob : job
      );

      setSavedJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);

      toast({
        title: "Job Updated",
        description: "Job has been successfully updated.",
      });

      setIsEditDialogOpen(false);
      setSelectedJob(null);

    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;

    setIsDeleting(true);
    
    try {
      const updatedJobs = savedJobs.filter(job => job.id !== selectedJob.id);
      setSavedJobs(updatedJobs);
      saveJobsToStorage(updatedJobs);

      toast({
        title: "Job Deleted",
        description: "Job has been successfully removed.",
      });

      setIsDeleteDialogOpen(false);
      setSelectedJob(null);

    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // State
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
    
    // Actions
    setNewJobTitle,
    setNewJobCompany,
    setNewJobDescription,
    handleSaveJob,
    handleViewJob,
    handleEditJob,
    handleDeleteJob,
    handleConfirmEdit,
    handleConfirmDelete,
    
    // Dialog controls
    setIsEditDialogOpen,
    setIsViewDialogOpen,
    setIsDeleteDialogOpen,
    setEditTitle,
    setEditCompany,
    setEditDescription
  };
}
