import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type Banner = {
  _id: string;
  title: string;
  description?: string;
  image: {
    public_id: string;
    url: string;
  };
  link?: string;
  slug?: string;
  priority: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

const GetAllBanner = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all banners
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await fetch(
        "https://clicon-h56m.onrender.com/api/v1/banner/get_all_banners"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      return data.data; // Assuming the API response has a 'data' field containing the banners
    },
    staleTime: 5 * 60 * 1000,
  });
  // Delete banner mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `https://clicon-h56m.onrender.com/api/v1/banner/delete_banner/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteId(null);
      // Show success toast
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      // Show error toast
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(
        `https://clicon-h56m.onrender.com/api/v1/banner/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update banner");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  // Filter banners based on search query
  const filteredBanners = banners?.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const getBannerStatus = (banner: Banner) => {
    if (!banner.isActive)
      return { label: "Inactive", variant: "secondary" as const };

    const now = new Date();
    const start = banner.startDate ? new Date(banner.startDate) : null;
    const end = banner.endDate ? new Date(banner.endDate) : null;

    if (start && now < start)
      return { label: "Scheduled", variant: "default" as const };
    if (end && now > end)
      return { label: "Expired", variant: "destructive" as const };

    return { label: "Active", variant: "default" as const };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading banners. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">All Banners</CardTitle>
              <CardDescription>
                Manage your website banners and promotions
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate("/dashboard/add-banner")}
              className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners && filteredBanners.length > 0 ? (
                  filteredBanners.map((banner) => {
                    const status = getBannerStatus(banner);
                    return (
                      <TableRow key={banner._id}>
                        <TableCell>
                          <img
                            src={banner.image.url}
                            alt={banner.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {banner.title}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate text-muted-foreground">
                          {banner.description || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{banner.priority}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {banner.startDate && (
                            <div>
                              <span className="text-muted-foreground">
                                From:{" "}
                              </span>
                              {format(
                                new Date(banner.startDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                          )}
                          {banner.endDate && (
                            <div>
                              <span className="text-muted-foreground">
                                To:{" "}
                              </span>
                              {format(new Date(banner.endDate), "MMM dd, yyyy")}
                            </div>
                          )}
                          {!banner.startDate && !banner.endDate && "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/dashboard/banners/${banner._id}`)
                                }>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/dashboard/banners/edit/${banner._id}`
                                  )
                                }>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleActiveMutation.mutate({
                                    id: banner._id,
                                    isActive: banner.isActive,
                                  })
                                }>
                                {banner.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(banner._id)}
                                className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-24 text-muted-foreground">
                      {searchQuery
                        ? "No banners found matching your search."
                        : "No banners yet. Create your first banner!"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GetAllBanner;
