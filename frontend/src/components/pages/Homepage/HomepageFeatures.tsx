import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Library, 
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Upload,
    title: "Resume Analysis",
    description: "Upload your resume for AI-powered analysis and optimization suggestions",
    action: "/app/upload",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Briefcase,
    title: "Job Descriptions",
    description: "Save and manage job postings to create targeted applications",
    action: "/app/jobs",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: FileText,
    title: "Cover Letter Generator",
    description: "Generate personalized cover letters tailored to specific job requirements",
    action: "/app/generate",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Get expert advice on job applications, interviews, and career strategy",
    action: "/app/chat",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    icon: Library,
    title: "Content Library",
    description: "Manage and reuse all your generated cover letters and emails",
    action: "/app/library",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  }
];

export function HomepageFeatures() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for your job search
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From resume optimization to interview preparation, we've got you covered
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => navigate(feature.action)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
