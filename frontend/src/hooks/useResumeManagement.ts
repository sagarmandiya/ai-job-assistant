import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

export interface Resume {
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

export function useResumeManagement() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved resumes from localStorage on component mount
  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = () => {
    try {
      const stored = localStorage.getItem('careercraft-saved-resumes');
      if (stored) {
        const resumesData = JSON.parse(stored).map((resume: { id: string; name: string; originalName: string; uploadDate: string; size: string; status: string; chunksIndexed: number; createdAt: string; filePath?: string }) => ({
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

  const uploadResume = async (file: File): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.uploadResume(file);
      
      if (response.error) {
        toast({
          title: "Upload Failed",
          description: `Error: ${response.error}`,
          variant: "destructive",
        });
        return false;
      }

      // Create resume object for local storage
      const newResume: Resume = {
        id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        originalName: file.name,
        uploadDate: new Date().toLocaleDateString(),
        size: formatFileSize(file.size),
        status: "analyzed",
        chunksIndexed: response.data?.chunks_indexed || 0,
        createdAt: new Date(),
      };

      // Add to local state and storage
      const updatedResumes = [newResume, ...resumes];
      setResumes(updatedResumes);
      saveResumesToStorage(updatedResumes);

      toast({
        title: "Success",
        description: `Resume uploaded! ${response.data?.chunks_indexed || 0} chunks indexed.`,
      });

      return true;
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResume = (resumeId: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== resumeId);
    setResumes(updatedResumes);
    saveResumesToStorage(updatedResumes);

    toast({
      title: "Success",
      description: "Resume deleted successfully",
    });
  };

  const useResumeForGeneration = (resume: Resume) => {
    toast({
      title: "Resume Active",
      description: `"${resume.name}" is now active for content generation`,
    });
  };

  const checkResumeStatus = () => {
    return resumes.length > 0;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    resumes,
    isLoading,
    uploadResume,
    deleteResume,
    useResumeForGeneration,
    checkResumeStatus,
    formatFileSize,
  };
}