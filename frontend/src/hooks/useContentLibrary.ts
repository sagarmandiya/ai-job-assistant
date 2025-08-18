import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedContent {
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

export function useContentLibrary() {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

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

    return newContent.id;
  };

  const updateContent = (contentId: string, updates: Partial<GeneratedContent>) => {
    const updatedContent = generatedContent.map(item => 
      item.id === contentId ? { ...item, ...updates, lastModified: new Date() } : item
    );

    setGeneratedContent(updatedContent);
    saveContentToStorage(updatedContent);

    toast({
      title: "Success",
      description: "Content updated successfully",
    });
  };

  const deleteContent = (contentId: string) => {
    const updatedContent = generatedContent.filter(item => item.id !== contentId);
    setGeneratedContent(updatedContent);
    saveContentToStorage(updatedContent);

    toast({
      title: "Success",
      description: "Content deleted successfully",
    });
  };

  const copyContent = (content: string, subjectLines?: string[]) => {
    let textToCopy = content;
    
    if (subjectLines && subjectLines.length > 0) {
      textToCopy = "Subject Line Options:\n" + 
        subjectLines.map((subject, index) => `${index + 1}. ${subject}`).join("\n") + 
        "\n\nEmail Content:\n" + content;
    }
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const downloadContent = (item: GeneratedContent) => {
    let textContent = item.content;
    
    if (item.subjectLines && item.subjectLines.length > 0) {
      textContent = "Subject Line Options:\n" + 
        item.subjectLines.map((subject, index) => `${index + 1}. ${subject}`).join("\n") + 
        "\n\nEmail Content:\n" + item.content;
    }

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Content downloaded successfully",
    });
  };

  const getContentStats = () => {
    const coverLetters = generatedContent.filter(item => item.type === "cover-letter").length;
    const emails = generatedContent.filter(item => item.type === "outreach-email").length;
    return { coverLetters, emails, total: generatedContent.length };
  };

  return {
    generatedContent,
    addGeneratedContent,
    updateContent,
    deleteContent,
    copyContent,
    downloadContent,
    getContentStats,
  };
}