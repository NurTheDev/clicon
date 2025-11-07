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
import { Bounce, toast } from "react-toastify";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: {
    public_id: string;
    url: string;
  };
  isActive: boolean;
  subCategories: string[];
  products: string[];
  discount: string[];
  createdAt: string;
  updatedAt: string;
};

const GetAllCategories = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/get-allCategory`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const result = await response.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  console.log(categories);
  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/delete_category/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to delete category");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteId(null);

      toast.success("Category deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/update_category/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to update category");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success("Category status updated!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  // Filter categories based on search query
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
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
              Error loading categories. Please try again.
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
              <CardTitle className="text-2xl font-bold">
                All Categories
              </CardTitle>
              <CardDescription>Manage your product categories</CardDescription>
            </div>
            <Button onClick={() => navigate("/dashboard/add-banner")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {categories?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {categories?.filter((c) => c.isActive).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {categories?.filter((c) => !c.isActive).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {categories?.reduce(
                    (acc, c) => acc + c.products?.length,
                    0
                  ) || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Sub Categories</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories && filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {category.slug}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {category.subCategories.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {category.products?.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(category.createdAt), "MMM dd, yyyy")}
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
                                navigate(
                                  `/dashboard/categories/${category.slug}`
                                )
                              }>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/categories/edit/${category.slug}`
                                )
                              }>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toggleActiveMutation.mutate({
                                  id: category._id,
                                  isActive: category.isActive,
                                })
                              }>
                              {category.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(category._id)}
                              className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center h-24 text-muted-foreground">
                      {searchQuery
                        ? "No categories found matching your search."
                        : "No categories yet. Create your first category!"}
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
              category and remove it from our servers. All associated
              subcategories and products will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GetAllCategories;
