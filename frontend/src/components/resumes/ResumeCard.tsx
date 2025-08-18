import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2, Calendar, FileIcon } from "lucide-react";
import { Resume } from "@/hooks/useResumeManagement";

interface ResumeCardProps {
  resume: Resume;
  index: number;
  onView: (resume: Resume) => void;
  onUse: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
}

export default function ResumeCard({ resume, index, onView, onUse, onDelete }: ResumeCardProps) {
  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
      return <FileIcon className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-primary" />;
  };

  return (
    <Card className="card-elevated animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {getFileIcon(resume.originalName)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm truncate" title={resume.name}>
                {resume.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{resume.uploadDate}</span>
                <span>•</span>
                <span>{resume.size}</span>
              </div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
            resume.status === "analyzed" 
              ? "bg-green-100 text-green-700" 
              : resume.status === "processing"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}>
            {resume.status}
          </div>
        </div>
        {resume.chunksIndexed && (
          <div className="text-xs text-muted-foreground">
            {resume.chunksIndexed} chunks indexed
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(resume)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onUse(resume)}
          >
            Use
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(resume)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}