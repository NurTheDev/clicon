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

const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required").trim(),
  isActive: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

const AddBrand = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
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

  const onSubmit = async (data: BrandFormValues) => {
    if (!imageFile) {
      toast.error("Please select a brand logo/image");
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
        }/brand/create-brand`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Brand created:", result);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to create brand");
      }

      // Reset form
      form.reset();
      setImageFile(null);
      setImagePreview("");

      // Show success toast
      toast.success("Brand created successfully!", {
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
        navigate("/dashboard/brands");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response.data?.data?.message || "Failed to create brand",
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
          <CardTitle className="text-2xl font-bold">Add New Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Brand Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter brand name"
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

              {/* Brand Logo/Image */}
              <div className="space-y-2">
                <FormLabel>Brand Logo/Image *</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 200x200px. Max size: 5MB
                </p>
                {imagePreview && (
                  <div className="relative w-48 h-48 border rounded-lg overflow-hidden mt-4 bg-white p-4 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
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
                        Enable or disable this brand
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
                  {isSubmitting ? "Creating..." : "Create Brand"}
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
                  onClick={() => navigate("/dashboard/brands")}
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

export default AddBrand;
