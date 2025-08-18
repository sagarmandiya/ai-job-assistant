import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, Sparkles, Shield } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Targeted Applications",
    description: "Create personalized content for each job application"
  },
  {
    icon: Zap,
    title: "Save Time",
    description: "Generate professional content in minutes, not hours"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Leverage advanced AI to optimize your job search"
  },
  {
    icon: Shield,
    title: "Professional Quality",
    description: "Get recruiter-ready documents every time"
  }
];

export function HomepageBenefits() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why choose CareerCraft.ai?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stand out from the competition with AI-powered tools designed for modern job seekers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {benefit.description}
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
