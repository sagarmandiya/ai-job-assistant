import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, MessageSquare, Library, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface DashboardActivityProps {
  recentActivity: RecentActivity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "resume_upload":
      return FileText;
    case "job_save":
      return Briefcase;
    case "content_generate":
      return Library;
    case "chat_session":
      return MessageSquare;
    default:
      return Calendar;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "resume_upload":
      return "bg-blue-100 text-blue-800";
    case "job_save":
      return "bg-green-100 text-green-800";
    case "content_generate":
      return "bg-purple-100 text-purple-800";
    case "chat_session":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

export function DashboardActivity({ recentActivity }: DashboardActivityProps) {
  const navigate = useNavigate();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and updates
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/app")}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start by uploading a resume or saving a job description</p>
            </div>
          ) : (
            recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
