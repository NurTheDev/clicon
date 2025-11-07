import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";
import * as z from "zod";

const subCategoryFormSchema = z.object({
  name: z.string().min(1, "Subcategory name is required").trim(),
  category: z.string().min(1, "Please select a category"),
  isActive: z.boolean().default(true),
});

type SubCategoryFormValues = z.infer<typeof subCategoryFormSchema>;

type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

const EditSubCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      name: "",
      category: "",
      isActive: true,
    },
  });

  // Fetch categories for dropdown
  const { data: categories, isLoading: loadingCategories } = useQuery<
    Category[]
  >({
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

  // Fetch subcategory data
  const { data: subCategory, isLoading } = useQuery<SubCategory>({
    queryKey: ["subcategory", slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/subCategory/get-subCategory/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subcategory");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!slug,
  });

  // Populate form when subcategory data is loaded
  useEffect(() => {
    if (subCategory) {
      form.reset({
        name: subCategory.name,
        category: subCategory.category._id,
        isActive: subCategory.isActive,
      });
    }
  }, [subCategory, form]);

  // Filter only active categories
  const activeCategories = categories?.filter((cat) => cat.isActive);

  // Update subcategory mutation
  const updateMutation = useMutation({
    mutationFn: async (data: SubCategoryFormValues) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/subCategory/update-subCategory/${slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            categoryId: data.category,
            isActive: data.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to update subcategory");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategory", slug] });
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success("Subcategory updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      // Navigate back to subcategories list after 1 second
      setTimeout(() => {
        navigate("/dashboard/subcategories");
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update subcategory", {
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

  const onSubmit = async (data: SubCategoryFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading || loadingCategories) {
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

  if (!subCategory) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Subcategory not found.</p>
              <Button onClick={() => navigate("/dashboard/subcategories")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subcategories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/subcategories")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Subcategories
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Subcategory</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Subcategory Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter subcategory name"
                        {...field}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      The slug will be automatically updated from the name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={updateMutation.isPending || loadingCategories}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCategories ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : activeCategories && activeCategories.length > 0 ? (
                          activeCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No active categories found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the parent category for this subcategory
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Active */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this subcategory
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Category Change Warning */}
              {subCategory.category._id !== form.watch("category") && (
                <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ You are changing the parent category. This subcategory
                    will be moved from{" "}
                    <strong>{subCategory.category.name}</strong> to the newly
                    selected category.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    updateMutation.isPending ||
                    loadingCategories ||
                    !activeCategories?.length
                  }
                  className="cursor-pointer">
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Update Subcategory"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/subcategories")}
                  disabled={updateMutation.isPending}
                  className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditSubCategory;
