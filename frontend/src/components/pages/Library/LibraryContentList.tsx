import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Eye, Copy, Download, Edit, Trash2, Calendar, Building } from "lucide-react";

interface GeneratedContent {
  id: string;
  type: "cover-letter" | "outreach-email";
  title: string;
  jobTitle: string;
  company: string;
  generatedDate: string;
  content: string;
  subjectLines?: string[];
  createdAt: Date;
  lastModified: Date;
}

interface LibraryContentListProps {
  generatedContent: GeneratedContent[];
  searchTerm: string;
  filterType: "all" | "cover-letter" | "outreach-email";
  onViewContent: (content: GeneratedContent) => void;
  onEditContent: (content: GeneratedContent) => void;
  onDeleteContent: (content: GeneratedContent) => void;
  onCopyContent: (content: GeneratedContent) => void;
  onDownloadContent: (content: GeneratedContent) => void;
}

const getContentIcon = (type: string) => {
  switch (type) {
    case "cover-letter":
      return FileText;
    case "outreach-email":
      return Mail;
    default:
      return FileText;
  }
};

const getContentColor = (type: string) => {
  switch (type) {
    case "cover-letter":
      return "bg-blue-100 text-blue-800";
    case "outreach-email":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export function LibraryContentList({
  generatedContent,
  searchTerm,
  filterType,
  onViewContent,
  onEditContent,
  onDeleteContent,
  onCopyContent,
  onDownloadContent
}: LibraryContentListProps) {
  // Filter content based on search term and type
  const filteredContent = generatedContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || content.type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (filteredContent.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filters"
              : "Generate some content to see it here"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredContent.map((content) => {
        const Icon = getContentIcon(content.type);
        return (
          <Card key={content.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{content.title}</h3>
                      <Badge className={getContentColor(content.type)}>
                        {content.type === "cover-letter" ? "Cover Letter" : "Outreach Email"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{content.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{content.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(content.lastModified)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.content.substring(0, 150)}...
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewContent(content)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopyContent(content)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownloadContent(content)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditContent(content)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteContent(content)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
