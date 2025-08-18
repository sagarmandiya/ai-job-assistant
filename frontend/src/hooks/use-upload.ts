import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UploadedResume {
  id: string;
  name: string;
  originalName: string;
  uploadDate: string;
  size: string;
  status: "processing" | "analyzed" | "error";
  chunksIndexed?: number;
  createdAt: Date;
  processingTime?: number;
  filePath?: string;
}

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  estimatedDuration: number;
}

interface UploadStats {
  totalUploaded: number;
  totalChunksIndexed: number;
  averageProcessingTime: number;
  successRate: number;
}

export function useUpload() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [stageStartTime, setStageStartTime] = useState(0);
  
  // Resume management
  const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([]);
  const [uploadStats, setUploadStats] = useState<UploadStats>({
    totalUploaded: 0,
    totalChunksIndexed: 0,
    averageProcessingTime: 0,
    successRate: 0
  });
  
  // Dialog states
  const [selectedResume, setSelectedResume] = useState<UploadedResume | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Processing stages definition
  const createProcessingStages = (fileType: string): ProcessingStage[] => {
    const baseStages = [
      {
        id: "upload",
        name: "Uploading File",
        description: "Transferring file to server...",
        completed: false,
        estimatedDuration: 2000
      },
      {
        id: "validation",
        name: "File Validation",
        description: "Checking file format and integrity...",
        completed: false,
        estimatedDuration: 1000
      }
    ];

    if (fileType === 'application/pdf') {
      baseStages.push(
        {
          id: "pdf-parsing",
          name: "PDF Text Extraction",
          description: "Extracting text content from PDF pages...",
          completed: false,
          estimatedDuration: 8080
        },
        {
          id: "text-processing",
          name: "Text Processing",
          description: "Cleaning and preparing text content...",
          completed: false,
          estimatedDuration: 3000
        }
      );
    } else {
      baseStages.push(
        {
          id: "doc-parsing",
          name: "Document Processing",
          description: "Extracting text from Word document...",
          completed: false,
          estimatedDuration: 5000
        }
      );
    }

    baseStages.push(
      {
        id: "chunking",
        name: "Text Chunking",
        description: "Splitting text into optimal segments...",
        completed: false,
        estimatedDuration: 2000
      },
      {
        id: "embedding",
        name: "AI Embedding Generation",
        description: "Creating semantic embeddings for each chunk...",
        completed: false,
        estimatedDuration: 85000 // This is the longest step
      },
      {
        id: "indexing",
        name: "Vector Indexing",
        description: "Storing embeddings in search index...",
        completed: false,
        estimatedDuration: 4000
      },
      {
        id: "finalization",
        name: "Finalization",
        description: "Completing setup for AI assistance...",
        completed: false,
        estimatedDuration: 1000
      }
    );

    return baseStages;
  };

  const loadExistingResumes = useCallback(() => {
    try {
      const stored = localStorage.getItem('careercraft-saved-resumes');
      if (stored) {
        const resumes = JSON.parse(stored).map((resume: { id: string; name: string; originalName: string; uploadDate: string; size: string; status: string; chunksIndexed: number; createdAt: string; filePath: string; processingTime?: number }) => ({
          ...resume,
          createdAt: new Date(resume.createdAt)
        }));
        setUploadedResumes(resumes);
        calculateUploadStats(resumes);
      }
    } catch (error) {
      console.error('Error loading existing resumes:', error);
    }
  }, []);

  // Load existing resumes on component mount
  useEffect(() => {
    loadExistingResumes();
  }, [loadExistingResumes]);

  // Progress simulation effect
  useEffect(() => {
    if (!uploading || processingStages.length === 0) return;

    const currentStage = processingStages[currentStageIndex];
    if (!currentStage) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - stageStartTime;
      const stageProgress = Math.min(elapsed / currentStage.estimatedDuration, 1);
      
      // Calculate overall progress
      const completedStages = currentStageIndex;
      const totalStages = processingStages.length;
      const currentStageWeight = 1 / totalStages;
      const overall = (completedStages / totalStages) + (stageProgress * currentStageWeight);
      
      setOverallProgress(Math.min(overall * 100, 99)); // Cap at 99% until actual completion
      
      // Update stage description with more detail
      if (currentStage.id === 'embedding' && stageProgress > 0) {
        const estimatedChunks = Math.ceil((currentUpload?.size || 0) / 5000); // Rough estimate
        const processedChunks = Math.floor(estimatedChunks * stageProgress);
        setUploadProgress(`Generating AI embeddings... (${processedChunks}/${estimatedChunks} chunks)`);
      } else {
        setUploadProgress(currentStage.description);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [uploading, currentStageIndex, stageStartTime, processingStages, currentUpload]);

  const advanceToNextStage = useCallback(() => {
    if (currentStageIndex < processingStages.length - 1) {
      // Mark current stage as completed
      setProcessingStages(prev => prev.map((stage, index) => 
        index === currentStageIndex ? { ...stage, completed: true } : stage
      ));
      
      // Move to next stage
      setCurrentStageIndex(prev => prev + 1);
      setStageStartTime(Date.now());
    }
  }, [currentStageIndex, processingStages.length]);

  const calculateUploadStats = (resumes: UploadedResume[]) => {
    const totalUploaded = resumes.length;
    const totalChunksIndexed = resumes.reduce((sum, resume) => sum + (resume.chunksIndexed || 0), 0);
    const processingTimes = resumes.map(r => r.processingTime || 0).filter(t => t > 0);
    const averageProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
      : 0;
    const successRate = totalUploaded > 0 
      ? (resumes.filter(r => r.status === 'analyzed').length / totalUploaded) * 100 
      : 0;

    setUploadStats({
      totalUploaded,
      totalChunksIndexed,
      averageProcessingTime,
      successRate
    });
  };

  const handleFileUpload = async (file: File) => {
    setCurrentUpload(file);
    setUploading(true);
    setOverallProgress(0);
    setUploadProgress("Starting upload...");
    
    // Initialize processing stages
    const stages = createProcessingStages(file.type);
    setProcessingStages(stages);
    setCurrentStageIndex(0);
    setStageStartTime(Date.now());

    try {
      // Simulate upload progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      advanceToNextStage(); // Upload complete

      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      advanceToNextStage(); // Validation complete

      // Simulate file processing based on type
      if (file.type === 'application/pdf') {
        await new Promise(resolve => setTimeout(resolve, 8080));
        advanceToNextStage(); // PDF parsing complete
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        advanceToNextStage(); // Text processing complete
      } else {
        await new Promise(resolve => setTimeout(resolve, 5000));
        advanceToNextStage(); // Document processing complete
      }

      // Simulate chunking
      await new Promise(resolve => setTimeout(resolve, 2000));
      advanceToNextStage(); // Chunking complete

      // Simulate embedding generation (longest step)
      await new Promise(resolve => setTimeout(resolve, 85000));
      advanceToNextStage(); // Embedding complete

      // Simulate indexing
      await new Promise(resolve => setTimeout(resolve, 4000));
      advanceToNextStage(); // Indexing complete

      // Simulate finalization
      await new Promise(resolve => setTimeout(resolve, 1000));
      advanceToNextStage(); // Finalization complete

      // Complete the upload
      setOverallProgress(100);
      setUploadProgress("Upload completed successfully!");

      // Create resume object
      const resume: UploadedResume = {
        id: Date.now().toString(),
        name: file.name,
        originalName: file.name,
        uploadDate: new Date().toLocaleDateString(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: "analyzed",
        chunksIndexed: Math.ceil(file.size / 5000), // Rough estimate
        createdAt: new Date(),
        processingTime: Math.round((Date.now() - stageStartTime) / 1000)
      };

      // Save to localStorage
      const existingResumes = JSON.parse(localStorage.getItem('careercraft-saved-resumes') || '[]');
      existingResumes.unshift(resume);
      localStorage.setItem('careercraft-saved-resumes', JSON.stringify(existingResumes));

      // Update state
      setUploadedResumes(prev => [resume, ...prev]);
      calculateUploadStats([resume, ...uploadedResumes]);

      toast({
        title: "Upload Successful",
        description: `Resume "${file.name}" has been processed and is ready for use.`,
      });

      // Reset upload state after a delay
      setTimeout(() => {
        setUploading(false);
        setCurrentUpload(null);
        setOverallProgress(0);
        setUploadProgress("");
        setProcessingStages([]);
        setCurrentStageIndex(0);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress("Upload failed. Please try again.");
      toast({
        title: "Upload Failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        setUploading(false);
        setCurrentUpload(null);
        setOverallProgress(0);
        setUploadProgress("");
        setProcessingStages([]);
        setCurrentStageIndex(0);
      }, 3000);
    }
  };

  const handleViewResume = (resume: UploadedResume) => {
    setSelectedResume(resume);
    setIsViewDialogOpen(true);
  };

  const handleDeleteResume = (resume: UploadedResume) => {
    setSelectedResume(resume);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedResume) return;

    setIsDeleting(true);
    
    try {
      // Remove from localStorage
      const existingResumes = JSON.parse(localStorage.getItem('careercraft-saved-resumes') || '[]');
      const updatedResumes = existingResumes.filter((r: { id: string }) => r.id !== selectedResume.id);
      localStorage.setItem('careercraft-saved-resumes', JSON.stringify(updatedResumes));

      // Update state
      setUploadedResumes(prev => prev.filter(r => r.id !== selectedResume.id));
      calculateUploadStats(uploadedResumes.filter(r => r.id !== selectedResume.id));

      toast({
        title: "Resume Deleted",
        description: "The resume has been successfully deleted.",
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedResume(null);
    }
  };

  return {
    // State
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
    
    // Actions
    setDragActive,
    handleFileUpload,
    handleViewResume,
    handleDeleteResume,
    handleConfirmDelete,
    onCloseViewDialog: () => setIsViewDialogOpen(false),
    onCloseDeleteDialog: () => setIsDeleteDialogOpen(false)
  };
}
