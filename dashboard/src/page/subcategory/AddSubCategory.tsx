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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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

const AddSubCategory = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Filter only active categories
  const activeCategories = categories?.filter((cat) => cat.isActive);

  const onSubmit = async (data: SubCategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/subCategory/create-subCategory`,
        {
          method: "POST",
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
      console.log("SubCategory created:", result);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to create subcategory");
      }

      // Reset form
      form.reset();

      // Show success toast
      toast.success("Subcategory created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      // Navigate back after 1 second
      setTimeout(() => {
        navigate("/dashboard/subcategories");
      }, 1000);
    } catch (error) {
      console.error("Failed to create subcategory:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create subcategory",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Add New Subcategory
          </CardTitle>
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The slug will be automatically generated from the name
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
                      defaultValue={field.value}
                      disabled={isSubmitting || loadingCategories}>
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    loadingCategories ||
                    !activeCategories?.length
                  }
                  className="cursor-pointer">
                  {isSubmitting ? "Creating..." : "Create Subcategory"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                  }}
                  disabled={isSubmitting}
                  className="cursor-pointer">
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/dashboard/subcategories")}
                  disabled={isSubmitting}
                  className="cursor-pointer">
                  Cancel
                </Button>
              </div>

              {/* Warning if no categories */}
              {!loadingCategories &&
                (!activeCategories || activeCategories.length === 0) && (
                  <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ No active categories found. Please create a category
                      first before adding subcategories.
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-yellow-800 underline"
                      onClick={() => navigate("/dashboard/categories/add")}>
                      Create Category
                    </Button>
                  </div>
                )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSubCategory;
