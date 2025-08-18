import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Eye, Copy, Edit, Download, Trash2, Building, Calendar } from "lucide-react";
import { GeneratedContent } from "@/hooks/useContentLibrary";

interface ContentGridProps {
  content: GeneratedContent[];
  onView: (content: GeneratedContent) => void;
  onCopy: (content: string, subjectLines?: string[]) => void;
  onEdit: (content: GeneratedContent) => void;
  onDownload: (content: GeneratedContent) => void;
  onDelete: (content: GeneratedContent) => void;
}

export default function ContentGrid({ 
  content, 
  onView, 
  onCopy, 
  onEdit, 
  onDownload, 
  onDelete 
}: ContentGridProps) {
  const getContentIcon = (type: string) => {
    return type === "cover-letter" ? 
      <FileText className="w-5 h-5 text-blue-600" /> : 
      <Mail className="w-5 h-5 text-green-600" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {content.map((item, index) => (
        <Card key={item.id} className="card-elevated animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getContentIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate" title={item.jobTitle}>
                    {item.jobTitle}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>{item.company}</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{item.generatedDate}</span>
                  </div>
                </div>
              </div>
              <Badge variant={item.type === "cover-letter" ? "default" : "secondary"}>
                {item.type === "cover-letter" ? "Cover Letter" : "Email"}
              </Badge>
            </div>
            {item.subjectLines && item.subjectLines.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {item.subjectLines.length} subject line options
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-3 rounded text-sm">
              <p className="line-clamp-3 text-muted-foreground">
                {item.content}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onView(item)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1" 
                onClick={() => onCopy(item.content, item.subjectLines)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(item)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDownload(item)}
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(item)}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}