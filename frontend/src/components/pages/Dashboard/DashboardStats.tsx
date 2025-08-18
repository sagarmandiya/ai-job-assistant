import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, MessageSquare, Library, TrendingUp } from "lucide-react";

interface DashboardStats {
  resumesCount: number;
  jobsCount: number;
  generatedContentCount: number;
  chatSessionsCount: number;
}

interface DashboardStatsProps {
  stats: DashboardStats;
  isOnline: boolean | null;
}

const statCards = [
  {
    title: "Resumes",
    description: "Uploaded resumes",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Job Descriptions",
    description: "Saved job postings",
    icon: Briefcase,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Generated Content",
    description: "Cover letters & emails",
    icon: Library,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Chat Sessions",
    description: "AI conversations",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export function DashboardStats({ stats, isOnline }: DashboardStatsProps) {
  const statValues = [
    stats.resumesCount,
    stats.jobsCount,
    stats.generatedContentCount,
    stats.chatSessionsCount
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statValues[index]}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              {isOnline === false && (
                <div className="mt-2 text-xs text-destructive">
                  Backend offline
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
