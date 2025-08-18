import { useState } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useGenerate() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"cover-letter" | "outreach-email">("cover-letter");
  const [jobDescription, setJobDescription] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingJob, setIsSavingJob] = useState(false);

  const handleSaveJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    setIsSavingJob(true);
    
    try {
      const response = await apiClient.setJobDescription(jobDescription);
      
      if (response.error) {
        toast({
          title: "Save Failed",
          description: `Error: ${response.error}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Job description saved! ${response.data?.chunks_indexed || 0} chunks indexed.`,
      });
      
    } catch (error) {
      console.error("Save job description error:", error);
      toast({
        title: "Error",
        description: "Failed to save job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingJob(false);
    }
  };

  const checkResumeStatus = () => {
    try {
      const stored = localStorage.getItem('careercraft-saved-resumes');
      if (stored) {
        const resumes = JSON.parse(stored);
        return resumes.length > 0;
      }
    } catch (error) {
      console.error('Error checking resume status:', error);
    }
    return false;
  };

  // Helper functions to extract job details from description
  const extractJobTitle = (description: string): string => {
    const lines = description.split('\n');
    const firstLine = lines[0]?.trim();
    
    // Check if first line looks like a job title
    if (firstLine && firstLine.length < 100 && !firstLine.includes('.')) {
      return firstLine;
    }
    
    // Look for common patterns
    const titlePatterns = [
      /(?:position|role|job title|title):\s*(.+?)(?:\n|$)/i,
      /(?:we are (?:looking for|seeking|hiring))\s+(?:a|an)?\s*(.+?)(?:\n|to|with|who)/i,
      /(?:join (?:our|us) (?:team )?as)\s+(?:a|an)?\s*(.+?)(?:\n|to|with|who)/i
    ];
    
    for (const pattern of titlePatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return "Position";
  };

  const extractCompanyName = (description: string): string => {
    const companyPatterns = [
      /(?:at|join)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+(?:is|we|our|team)|,|\n)/,
      /([A-Z][a-zA-Z\s&]+?)(?:\s+is\s+(?:looking|seeking|hiring))/,
      /company:\s*(.+?)(?:\n|$)/i,
      /about\s+([A-Z][a-zA-Z\s&]+?):/
    ];
    
    for (const pattern of companyPatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        if (!['We', 'Our', 'The Company', 'Team', 'Position'].includes(company)) {
          return company;
        }
      }
    }
    
    return "Company";
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description first",
        variant: "destructive",
      });
      return;
    }

    // Check if user has uploaded a resume
    const hasResume = checkResumeStatus();
    if (!hasResume) {
      toast({
        title: "Resume Required",
        description: "Please upload a resume first in the Resumes page before generating content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // First save the job description to the backend
      const saveResponse = await apiClient.setJobDescription(jobDescription);
      
      if (saveResponse.error) {
        toast({
          title: "Save Failed",
          description: `Error: ${saveResponse.error}`,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Generate content
      const response = activeTab === "cover-letter" 
        ? await apiClient.generateCoverLetter(jobDescription, additionalContext)
        : await apiClient.generateRecruiterEmail(jobDescription, additionalContext);
      
      console.log('API Response:', response);
      
      if (response.error) {
        toast({
          title: "Generation Failed",
          description: `Error: ${response.error}. Status: ${response.status}`,
          variant: "destructive",
        });
        return;
      }

      const content = response.data?.content || response.content || "";
      
      console.log('Extracted content:', content);
      
      if (!content || content.trim() === "") {
        console.error('Response structure:', response);
        toast({
          title: "Error",
          description: "No content was generated. Please check the console for response details.",
          variant: "destructive",
        });
        return;
      }

      // Parse outreach email content to separate subject lines
      let emailSubjectLines: string[] = [];
      let finalContent = content;

      if (activeTab === "outreach-email" && content.includes("Subject Line Options:")) {
        const lines = content.split('\n');
        const subjectStart = lines.findIndex(line => line.includes('Subject Line Options:'));
        const emailStart = lines.findIndex(line => line.includes('Email:'));
        
        if (subjectStart !== -1 && emailStart !== -1) {
          // Extract subject lines
          const subjectSection = lines.slice(subjectStart + 1, emailStart);
          emailSubjectLines = subjectSection
            .filter(line => line.trim() && /^\d+\./.test(line.trim()))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());
          
          setSubjectLines(emailSubjectLines);
          
          // Get just the email content
          const emailContent = lines.slice(emailStart + 1).join('\n').trim();
          finalContent = emailContent;
          setGeneratedContent(emailContent);
        } else {
          // Fallback if parsing fails
          setGeneratedContent(content);
        }
      } else {
        // For cover letters or if no subject lines found
        setGeneratedContent(content);
        setSubjectLines([]);
      }

      // Add to library with proper variables
      if (typeof window.addToLibrary === 'function') {
        const jobTitle = extractJobTitle(jobDescription);
        const companyName = extractCompanyName(jobDescription);
        
        window.addToLibrary(
          activeTab,
          jobTitle,
          companyName,
          finalContent,
          activeTab === "outreach-email" ? emailSubjectLines : undefined
        );
      }

      toast({
        title: "Success",
        description: `${activeTab === "cover-letter" ? "Cover letter" : "Outreach email"} generated successfully!`,
      });
      
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (activeTab === "outreach-email" && subjectLines.length > 0) {
      const fullContent = "Subject Line Options:\n" + 
        subjectLines.map((subject, index) => `${index + 1}. ${subject}`).join("\n") + 
        "\n\nEmail Content:\n" + generatedContent;
      navigator.clipboard.writeText(fullContent);
    } else {
      navigator.clipboard.writeText(generatedContent);
    }
    
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const handleDownload = () => {
    let content = generatedContent;
    
    if (activeTab === "outreach-email" && subjectLines.length > 0) {
      content = "Subject Line Options:\n" + 
        subjectLines.map((subject, index) => `${index + 1}. ${subject}`).join("\n") + 
        "\n\nEmail Content:\n" + generatedContent;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab === "cover-letter" ? "cover-letter" : "outreach-email"}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Content downloaded successfully",
    });
  };

  const handleTabChange = (tab: "cover-letter" | "outreach-email") => {
    setActiveTab(tab);
    if (tab === "cover-letter") {
      setSubjectLines([]);
    }
  };

  return {
    // State
    activeTab,
    jobDescription,
    additionalContext,
    generatedContent,
    subjectLines,
    isGenerating,
    isSavingJob,
    
    // Actions
    setJobDescription,
    setAdditionalContext,
    handleSaveJobDescription,
    handleGenerate,
    handleCopy,
    handleDownload,
    handleTabChange,
    
    // Utilities
    checkResumeStatus
  };
}
