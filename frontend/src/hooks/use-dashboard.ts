import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  resumesCount: number;
  jobsCount: number;
  generatedContentCount: number;
  chatSessionsCount: number;
}

interface ActivityMetadata {
  fileName?: string;
  jobTitle?: string;
  company?: string;
  contentType?: string;
  sessionId?: string;
}

interface RecentActivity {
  id: string;
  type: "resume_upload" | "job_save" | "content_generate" | "chat_session";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: ActivityMetadata;
}

interface ActivitySummary {
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

export function useDashboard() {
  const { toast } = useToast();
  
  // State management
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    resumesCount: 0,
    jobsCount: 0,
    generatedContentCount: 0,
    chatSessionsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary>({
    todayCount: 0,
    weekCount: 0,
    monthCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkBackendConnection = useCallback(async () => {
    try {
      const response = await apiClient.checkHealth();
      setIsOnline(response.status === 200);
      
      if (response.status !== 200) {
        toast({
          title: "Backend Connection",
          description: "Cannot connect to FastAPI backend. Please ensure it's running on localhost:8080",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsOnline(false);
      toast({
        title: "Backend Connection",
        description: "Cannot connect to FastAPI backend. Please ensure it's running on localhost:8080",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadStats = (): DashboardStats => {
    try {
      // Load resumes
      const resumesData = localStorage.getItem('careercraft-saved-resumes');
      const resumesCount = resumesData ? JSON.parse(resumesData).length : 0;

      // Load jobs
      const jobsData = localStorage.getItem('careercraft-saved-jobs');
      const jobsCount = jobsData ? JSON.parse(jobsData).length : 0;

      // Load generated content
      const contentData = localStorage.getItem('careercraft-generated-content');
      const generatedContentCount = contentData ? JSON.parse(contentData).length : 0;

      // Load chat sessions
      const chatData = localStorage.getItem('careercraft-chat-sessions');
      const chatSessionsCount = chatData ? JSON.parse(chatData).length : 0;

      return {
        resumesCount,
        jobsCount,
        generatedContentCount,
        chatSessionsCount
      };
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      return {
        resumesCount: 0,
        jobsCount: 0,
        generatedContentCount: 0,
        chatSessionsCount: 0
      };
    }
  };

  const loadRecentActivity = (): RecentActivity[] => {
    try {
      const activities: RecentActivity[] = [];

      // Load resume activities
      const resumesData = localStorage.getItem('careercraft-saved-resumes');
      if (resumesData) {
        const resumes = JSON.parse(resumesData);
        resumes.slice(0, 3).forEach((resume: { id: string; name: string; originalName: string; chunksIndexed: number; createdAt: string }) => {
          activities.push({
            id: `resume-${resume.id}`,
            type: "resume_upload",
            title: "Resume Uploaded",
            description: `"${resume.name}" processed with ${resume.chunksIndexed || 0} chunks`,
            timestamp: new Date(resume.createdAt),
            metadata: { fileName: resume.originalName }
          });
        });
      }

      // Load job activities
      const jobsData = localStorage.getItem('careercraft-saved-jobs');
      if (jobsData) {
        const jobs = JSON.parse(jobsData);
        jobs.slice(0, 3).forEach((job: { id: string; title: string; company: string; createdAt: string }) => {
          activities.push({
            id: `job-${job.id}`,
            type: "job_save",
            title: "Job Description Saved",
            description: `${job.title} at ${job.company}`,
            timestamp: new Date(job.createdAt),
            metadata: { company: job.company, jobTitle: job.title }
          });
        });
      }

      // Load content generation activities
      const contentData = localStorage.getItem('careercraft-generated-content');
      if (contentData) {
        const content = JSON.parse(contentData);
        content.slice(0, 3).forEach((item: { id: string; type: string; jobTitle: string; company: string; createdAt: string }) => {
          activities.push({
            id: `content-${item.id}`,
            type: "content_generate",
            title: `${item.type === 'cover-letter' ? 'Cover Letter' : 'Outreach Email'} Generated`,
            description: `${item.jobTitle} at ${item.company}`,
            timestamp: new Date(item.createdAt),
            metadata: { contentType: item.type, company: item.company, jobTitle: item.jobTitle }
          });
        });
      }

      // Sort by timestamp (newest first) and limit to 8 items
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 8);

    } catch (error) {
      console.error('Error loading recent activity:', error);
      return [];
    }
  };

  const calculateActivitySummary = (activities: RecentActivity[]): ActivitySummary => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      todayCount: activities.filter(a => a.timestamp >= today).length,
      weekCount: activities.filter(a => a.timestamp >= weekAgo).length,
      monthCount: activities.filter(a => a.timestamp >= monthAgo).length
    };
  };

  const loadDashboardData = useCallback(() => {
    // Load stats from localStorage
    const newStats = loadStats();
    setStats(newStats);

    // Load recent activity
    const activity = loadRecentActivity();
    setRecentActivity(activity);

    // Calculate activity summary
    const summary = calculateActivitySummary(activity);
    setActivitySummary(summary);
  }, []);

  // Load data on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      await checkBackendConnection();
      loadDashboardData();
      setIsLoading(false);
    };

    initializeDashboard();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [checkBackendConnection, loadDashboardData]);

  return {
    isOnline,
    stats,
    recentActivity,
    activitySummary,
    isLoading,
    loadDashboardData,
    checkBackendConnection
  };
}
