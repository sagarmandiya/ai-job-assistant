import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Briefcase, MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "Upload Resume",
    description: "Add a new resume for analysis",
    icon: Upload,
    action: "/app/upload",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Save Job",
    description: "Add a job description",
    icon: Briefcase,
    action: "/app/jobs",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Generate Content",
    description: "Create cover letter or email",
    icon: FileText,
    action: "/app/generate",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Chat with AI",
    description: "Get career advice",
    icon: MessageSquare,
    action: "/app/chat",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to get you started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => navigate(action.action)}
              >
                <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center mr-3`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
