import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";

interface GenerationTabsProps {
  activeTab: "cover-letter" | "outreach-email";
  onTabChange: (tab: "cover-letter" | "outreach-email") => void;
}

export function GenerationTabs({
  activeTab,
  onTabChange
}: GenerationTabsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeTab === "cover-letter" ? "default" : "outline"}
        onClick={() => onTabChange("cover-letter")}
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Cover Letter
      </Button>
      <Button
        variant={activeTab === "outreach-email" ? "default" : "outline"}
        onClick={() => onTabChange("outreach-email")}
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Outreach Email
      </Button>
    </div>
  );
}
