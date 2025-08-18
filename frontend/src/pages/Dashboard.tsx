import { DashboardStats } from "@/components/pages/Dashboard/DashboardStats";
import { DashboardActivity } from "@/components/pages/Dashboard/DashboardActivity";
import { DashboardQuickActions } from "@/components/pages/Dashboard/DashboardQuickActions";
import { useDashboard } from "@/hooks/use-dashboard";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function Dashboard() {
  const { isOnline, stats, recentActivity, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your job search.
            </p>
          </div>
        </div>
      </div>

      <DashboardStats stats={stats} isOnline={isOnline} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardActivity recentActivity={recentActivity} />
        <DashboardQuickActions />
      </div>
    </div>
  );
}
