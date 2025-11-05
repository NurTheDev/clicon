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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import * as z from "zod";

const bannerFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().trim().optional(),
    link: z.string().url("Invalid URL").trim().optional().or(z.literal("")),
    priority: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Start date must be earlier than or equal to end date",
      path: ["endDate"],
    }
  );

type BannerFormValues = z.infer<typeof bannerFormSchema>;

const AddBanner = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      priority: 0,
      isActive: true,
      startDate: "",
      endDate: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the file for upload
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: BannerFormValues) => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData to send both form data and image
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.link) formData.append("link", data.link);
      formData.append("priority", data.priority.toString());
      formData.append("isActive", data.isActive.toString());
      if (data.startDate) formData.append("startDate", data.startDate);
      if (data.endDate) formData.append("endDate", data.endDate);

      // Append the image file
      formData.append("image", imageFile);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/banner/create_banner`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log("Banner created:", result);
      // Check if response is successful based on your API structure
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to create banner");
      }
      // Reset form and show success message
      form.reset();
      setImageFile(null);
      setImagePreview("");
      // Show success toast/notification
      toast.success("Banner created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Failed to create banner:", error);
      // Show error toast
      toast.error(
        error instanceof Error ? error.message : "Failed to create banner",
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
          <CardTitle className="text-2xl font-bold">Add New Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter banner description"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel>Banner Image *</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  required
                />
                {imagePreview && (
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional link when users click the banner
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Higher priority banners appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        Enable or disable this banner
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !imageFile}
                  className="cursor-pointer">
                  {isSubmitting ? "Creating..." : "Create Banner"}
                </Button>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setImageFile(null);
                    setImagePreview("");
                  }}>
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBanner;
