import { HomepageNavbar } from "@/components/pages/Homepage/HomepageNavbar";
import { HomepageHero } from "@/components/pages/Homepage/HomepageHero";
import { HomepageFeatures } from "@/components/pages/Homepage/HomepageFeatures";
import { HomepageBenefits } from "@/components/pages/Homepage/HomepageBenefits";
import { HomepageFooter } from "@/components/pages/Homepage/HomepageFooter";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <HomepageNavbar />
      <HomepageHero />
      <HomepageFeatures />
      <HomepageBenefits />
      <HomepageFooter />
    </div>
  );
}