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
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";
import * as z from "zod";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const AddCategory = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData to send both form data and image
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("isActive", data.isActive.toString());
      formData.append("image", imageFile);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/create_category`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Category created:", result);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to create category");
      }

      // Reset form
      form.reset();
      setImageFile(null);
      setImagePreview("");

      // Show success toast
      toast.success("Category created successfully!", {
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
        navigate("/dashboard/categories");
      }, 1000);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
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
          <CardTitle className="text-2xl font-bold">Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
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

              {/* Category Image */}
              <div className="space-y-2">
                <FormLabel>Category Image *</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 400x400px. Max size: 5MB
                </p>
                {imagePreview && (
                  <div className="relative w-48 h-48 border rounded-lg overflow-hidden mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Is Active */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this category
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
                  disabled={isSubmitting || !imageFile}
                  className="cursor-pointer">
                  {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  disabled={isSubmitting}
                  className="cursor-pointer">
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/dashboard/categories")}
                  disabled={isSubmitting}
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

export default AddCategory;
