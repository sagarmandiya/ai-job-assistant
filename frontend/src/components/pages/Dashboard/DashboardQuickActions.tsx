import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
              <div
                key={action.title}
                className="group cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => navigate(action.action)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(action.action);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm leading-tight mb-1 text-foreground">
                      {action.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
