import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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

export function useResumes() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Resume management states
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // View/Delete dialog states
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load saved resumes from localStorage on component mount
  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = () => {
    try {
      const stored = localStorage.getItem('careercraft-saved-resumes');
      if (stored) {
        const resumesData = JSON.parse(stored).map((resume: { id: string; name: string; originalName: string; uploadDate: string; size: string; status: string; chunksIndexed: number; createdAt: string; filePath: string }) => ({
          ...resume,
          createdAt: new Date(resume.createdAt)
        }));
        setResumes(resumesData.sort((a: Resume, b: Resume) => b.createdAt.getTime() - a.createdAt.getTime()));
      }
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    }
  };

  const saveResumesToStorage = (resumeData: Resume[]) => {
    try {
      localStorage.setItem('careercraft-saved-resumes', JSON.stringify(resumeData));
    } catch (error) {
      console.error('Error saving resumes to storage:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setIsUploadDialogOpen(true);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Upload to backend
      const response = await apiClient.uploadResume(selectedFile);
      
      if (response.error) {
        toast({
          title: "Upload Failed",
          description: `Error: ${response.error}`,
          variant: "destructive",
        });
        return;
      }

      // Create new resume object
      const newResume: Resume = {
        id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: selectedFile.name,
        originalName: selectedFile.name,
        uploadDate: new Date().toLocaleDateString(),
        size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
        status: "analyzed",
        chunksIndexed: response.data?.chunks_indexed || Math.ceil(selectedFile.size / 5000),
        createdAt: new Date(),
        filePath: response.data?.file_path || selectedFile.name,
      };

      // Add to local storage
      const updatedResumes = [newResume, ...resumes];
      setResumes(updatedResumes);
      saveResumesToStorage(updatedResumes);

      // Clear form
      setSelectedFile(null);
      setIsUploadDialogOpen(false);

      toast({
        title: "Upload Successful",
        description: `Resume uploaded and analyzed successfully. ${newResume.chunksIndexed} chunks indexed.`,
      });

    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setIsViewDialogOpen(true);
  };

  const handleDeleteResume = (resume: Resume) => {
    setSelectedResume(resume);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedResume) return;

    setIsDeleting(true);
    
    try {
      const updatedResumes = resumes.filter(resume => resume.id !== selectedResume.id);
      setResumes(updatedResumes);
      saveResumesToStorage(updatedResumes);

      toast({
        title: "Resume Deleted",
        description: "Resume has been successfully removed.",
      });

      setIsDeleteDialogOpen(false);
      setSelectedResume(null);

    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // State
    resumes,
    isLoading,
    isUploading,
    selectedFile,
    isUploadDialogOpen,
    selectedResume,
    isViewDialogOpen,
    isDeleteDialogOpen,
    isDeleting,
    
    // Actions
    handleFileSelect,
    handleUploadResume,
    handleViewResume,
    handleDeleteResume,
    handleConfirmDelete,
    
    // Dialog controls
    setIsUploadDialogOpen,
    setIsViewDialogOpen,
    setIsDeleteDialogOpen
  };
}
