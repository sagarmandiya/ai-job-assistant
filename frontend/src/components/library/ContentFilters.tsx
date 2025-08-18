import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Mail } from "lucide-react";

interface ContentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: "all" | "cover-letter" | "outreach-email";
  setFilterType: (type: "all" | "cover-letter" | "outreach-email") => void;
  stats: {
    total: number;
    coverLetters: number;
    emails: number;
  };
}

export default function ContentFilters({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  stats 
}: ContentFiltersProps) {
  return (
    <Card className="card-elevated">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, job, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              size="sm"
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filterType === "cover-letter" ? "default" : "outline"}
              onClick={() => setFilterType("cover-letter")}
              size="sm"
            >
              <FileText className="w-3 h-3 mr-1" />
              Cover Letters ({stats.coverLetters})
            </Button>
            <Button
              variant={filterType === "outreach-email" ? "default" : "outline"}
              onClick={() => setFilterType("outreach-email")}
              size="sm"
            >
              <Mail className="w-3 h-3 mr-1" />
              Emails ({stats.emails})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}