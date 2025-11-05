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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
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

const EditBanner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");

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

  // Fetch banner data
  const { data: banner, isLoading } = useQuery<Banner>({
    queryKey: ["banner", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/banner/get_banner/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch banner");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!id,
  });

  // Populate form when banner data is loaded
  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title,
        description: banner.description || "",
        link: banner.link || "",
        priority: banner.priority,
        isActive: banner.isActive,
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString().slice(0, 16)
          : "",
        endDate: banner.endDate
          ? new Date(banner.endDate).toISOString().slice(0, 16)
          : "",
      });
      setCurrentImage(banner.image.url);
    }
  }, [banner, form]);

  // Update banner mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/banner/update_banner/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to update banner");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner", id] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });

      toast.success("Banner updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      // Navigate back to banners list after 1 second
      setTimeout(() => {
        navigate("/dashboard/banners");
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update banner", {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: BannerFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.link) formData.append("link", data.link);
    formData.append("priority", data.priority.toString());
    formData.append("isActive", data.isActive.toString());
    if (data.startDate) formData.append("startDate", data.startDate);
    if (data.endDate) formData.append("endDate", data.endDate);

    // Only append new image if one was selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    updateMutation.mutate(formData);
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

  if (!banner) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Banner not found.</p>
              <Button onClick={() => navigate("/dashboard/banners")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Banners
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
          onClick={() => navigate("/dashboard/banners")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Banners
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Banner</CardTitle>
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
                <FormLabel>Banner Image</FormLabel>
                <div className="space-y-4">
                  {/* Current Image */}
                  {currentImage && !imagePreview && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Current Image:
                      </p>
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <img
                          src={currentImage}
                          alt="Current banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* New Image Preview */}
                  {imagePreview && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        New Image Preview:
                      </p>
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={updateMutation.isPending}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep the current image
                  </p>
                </div>
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
                  disabled={updateMutation.isPending}
                  className="cursor-pointer">
                  {updateMutation.isPending ? "Updating..." : "Update Banner"}
                </Button>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/banners")}>
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

export default EditBanner;
