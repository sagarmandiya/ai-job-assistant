import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useState } from "react";

export function AccountSettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Simulate deletion process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Account Status */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Status
          </CardTitle>
          <CardDescription>
            Your current account information and subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Subscription Plan</p>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Active
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">January 2024</p>
            </div>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Last Login</p>
              <p className="text-sm text-muted-foreground">Today at 2:30 PM</p>
            </div>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                className="text-contain"
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                className="text-contain"
                maxLength={50}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                className="text-contain flex-1"
              />
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="+1 (555) 123-4567" 
              className="text-contain"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="San Francisco, CA" 
              className="text-contain"
            />
          </div>
          <Button className="btn-primary">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Professional Information
          </CardTitle>
          <CardDescription>
            Add your professional details and social links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input 
              id="title" 
              placeholder="Software Engineer" 
              className="text-contain"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="company">Current Company</Label>
            <Input 
              id="company" 
              placeholder="Tech Corp" 
              className="text-contain"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input 
              id="linkedin" 
              placeholder="https://linkedin.com/in/yourprofile" 
              className="text-contain"
            />
          </div>
          <div>
            <Label htmlFor="website">Personal Website</Label>
            <Input 
              id="website" 
              placeholder="https://yourwebsite.com" 
              className="text-contain"
            />
          </div>
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <textarea 
              id="bio" 
              placeholder="Tell us about your professional background..."
              className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none text-contain"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Brief description of your professional experience and expertise
            </p>
          </div>
          <Button className="btn-primary">Save Professional Info</Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export your data or manage your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Export My Data</p>
              <p className="text-sm text-muted-foreground">
                Download all your data including resumes, job descriptions, and generated content
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Warning</p>
              <p>Account deletion is permanent and cannot be undone. All your data will be permanently removed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
