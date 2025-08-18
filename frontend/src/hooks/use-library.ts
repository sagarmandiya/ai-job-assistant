import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

export function useLibrary() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "cover-letter" | "outreach-email">("all");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load content on component mount
  useEffect(() => {
    loadGeneratedContent();
  }, []);

  const loadGeneratedContent = () => {
    try {
      const stored = localStorage.getItem('careercraft-generated-content');
      if (stored) {
        const contentData = JSON.parse(stored).map((item: { id: string; type: string; title: string; jobTitle: string; company: string; generatedDate: string; content: string; subjectLines: string[]; createdAt: string; lastModified: string }) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          lastModified: new Date(item.lastModified)
        }));
        setGeneratedContent(contentData.sort((a: GeneratedContent, b: GeneratedContent) => 
          b.lastModified.getTime() - a.lastModified.getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading generated content:', error);
    }
  };

  const saveContentToStorage = (content: GeneratedContent[]) => {
    try {
      localStorage.setItem('careercraft-generated-content', JSON.stringify(content));
    } catch (error) {
      console.error('Error saving content to storage:', error);
    }
  };

  // Function to add new generated content (called from other pages)
  const addGeneratedContent = (
    type: "cover-letter" | "outreach-email",
    jobTitle: string,
    company: string,
    content: string,
    subjectLines?: string[]
  ) => {
    const newContent: GeneratedContent = {
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: `${type === "cover-letter" ? "Cover Letter" : "Outreach Email"} - ${jobTitle}`,
      jobTitle,
      company,
      generatedDate: new Date().toLocaleDateString(),
      content,
      subjectLines: subjectLines || [],
      createdAt: new Date(),
      lastModified: new Date(),
    };

    const updatedContent = [newContent, ...generatedContent];
    setGeneratedContent(updatedContent);
    saveContentToStorage(updatedContent);

    toast({
      title: "Content Saved",
      description: "Your generated content has been saved to the library.",
    });
  };

  const handleViewContent = (content: GeneratedContent) => {
    setSelectedContent(content);
    setIsViewDialogOpen(true);
  };

  const handleEditContent = (content: GeneratedContent) => {
    setSelectedContent(content);
    setEditTitle(content.title);
    setEditJobTitle(content.jobTitle);
    setEditCompany(content.company);
    setEditContent(content.content);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = (content: GeneratedContent) => {
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };

  const handleCopyContent = (content: GeneratedContent) => {
    navigator.clipboard.writeText(content.content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const handleDownloadContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Content downloaded successfully",
    });
  };

  const handleConfirmEdit = async () => {
    if (!selectedContent) return;

    setIsUpdating(true);
    
    try {
      const updatedContent: GeneratedContent = {
        ...selectedContent,
        title: editTitle,
        jobTitle: editJobTitle,
        company: editCompany,
        content: editContent,
        lastModified: new Date(),
      };

      const updatedContentList = generatedContent.map(content =>
        content.id === selectedContent.id ? updatedContent : content
      );

      setGeneratedContent(updatedContentList);
      saveContentToStorage(updatedContentList);

      toast({
        title: "Content Updated",
        description: "Your content has been successfully updated.",
      });

      setIsEditDialogOpen(false);
      setSelectedContent(null);

    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedContent) return;

    setIsDeleting(true);
    
    try {
      const updatedContentList = generatedContent.filter(content => content.id !== selectedContent.id);
      setGeneratedContent(updatedContentList);
      saveContentToStorage(updatedContentList);

      toast({
        title: "Content Deleted",
        description: "Content has been successfully removed.",
      });

      setIsDeleteDialogOpen(false);
      setSelectedContent(null);

    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateNew = () => {
    navigate("/app/generate");
  };

  return {
    // State
    searchTerm,
    filterType,
    generatedContent,
    isLoading,
    selectedContent,
    isViewDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    editTitle,
    editJobTitle,
    editCompany,
    editContent,
    isUpdating,
    isDeleting,
    
    // Actions
    setSearchTerm,
    setFilterType,
    addGeneratedContent,
    handleViewContent,
    handleEditContent,
    handleDeleteContent,
    handleCopyContent,
    handleDownloadContent,
    handleConfirmEdit,
    handleConfirmDelete,
    handleGenerateNew,
    
    // Dialog controls
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setEditTitle,
    setEditJobTitle,
    setEditCompany,
    setEditContent
  };
}
