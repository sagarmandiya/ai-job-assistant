import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Library, Search, Plus } from "lucide-react";
import { LibraryContentList } from "@/components/pages/Library/LibraryContentList";
import { LibraryDialogs } from "@/components/pages/Library/LibraryDialogs";
import { useLibrary } from "@/hooks/use-library";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function LibraryPage() {
  const {
    searchTerm,
    filterType,
    generatedContent,
    isLoading,
    selectedContent,
    isViewDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    editTitle,
    editJobTitle,
    editCompany,
    editContent,
    isUpdating,
    isDeleting,
    setSearchTerm,
    setFilterType,
    handleViewContent,
    handleEditContent,
    handleDeleteContent,
    handleCopyContent,
    handleDownloadContent,
    handleConfirmEdit,
    handleConfirmDelete,
    handleGenerateNew,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setEditTitle,
    setEditJobTitle,
    setEditCompany,
    setEditContent
  } = useLibrary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
            <p className="text-muted-foreground">
              Manage and organize your generated cover letters and outreach emails
            </p>
          </div>
          <Button onClick={handleGenerateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="w-5 h-5" />
            Library Overview
          </CardTitle>
          <CardDescription>
            Your generated content statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{generatedContent.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {generatedContent.filter(c => c.type === "cover-letter").length}
              </div>
              <div className="text-sm text-muted-foreground">Cover Letters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {generatedContent.filter(c => c.type === "outreach-email").length}
              </div>
              <div className="text-sm text-muted-foreground">Outreach Emails</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific content in your library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by title, company, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "cover-letter" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("cover-letter")}
              >
                Cover Letters
              </Button>
              <Button
                variant={filterType === "outreach-email" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("outreach-email")}
              >
                Outreach Emails
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <LibraryContentList
        generatedContent={generatedContent}
        searchTerm={searchTerm}
        filterType={filterType}
        onViewContent={handleViewContent}
        onEditContent={handleEditContent}
        onDeleteContent={handleDeleteContent}
        onCopyContent={handleCopyContent}
        onDownloadContent={handleDownloadContent}
      />

      {/* Dialogs */}
      <LibraryDialogs
        selectedContent={selectedContent}
        isViewDialogOpen={isViewDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        editTitle={editTitle}
        editJobTitle={editJobTitle}
        editCompany={editCompany}
        editContent={editContent}
        onCloseViewDialog={() => setIsViewDialogOpen(false)}
        onCloseEditDialog={() => setIsEditDialogOpen(false)}
        onCloseDeleteDialog={() => setIsDeleteDialogOpen(false)}
        onEditTitleChange={setEditTitle}
        onEditJobTitleChange={setEditJobTitle}
        onEditCompanyChange={setEditCompany}
        onEditContentChange={setEditContent}
        onConfirmEdit={handleConfirmEdit}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
