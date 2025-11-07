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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";
import * as z from "zod";

const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required").trim(),
  isActive: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

type Brand = {
  _id: string;
  name: string;
  slug: string;
  image: {
    public_id: string;
    url: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const EditBrand = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  // Fetch brand data
  const { data: brand, isLoading } = useQuery<Brand>({
    queryKey: ["brand", slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/brand/single-brand/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch brand");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!slug,
  });

  // Populate form when brand data is loaded
  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        isActive: brand.isActive,
      });
      // Set existing image as preview
      setImagePreview(brand.image.url);
    }
  }, [brand, form]);

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

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(brand?.image.url || "");
  };

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: async (data: BrandFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("isActive", data.isActive.toString());

      // Only append image if a new one is selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/brand/update-brand/${slug}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to update brand");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand", slug] });
      queryClient.invalidateQueries({ queryKey: ["brands"] });

      toast.success("Brand updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      // Navigate back to brands list after 1 second
      setTimeout(() => {
        navigate("/dashboard/brands");
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update brand", {
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

  const onSubmit = async (data: BrandFormValues) => {
    updateMutation.mutate(data);
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

  if (!brand) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Brand not found.</p>
              <Button onClick={() => navigate("/dashboard/brands")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Brands
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
          onClick={() => navigate("/dashboard/brands")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Brand</CardTitle>
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

              {/* Brand Logo/Image */}
              <div className="space-y-2">
                <FormLabel>Brand Logo/Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={updateMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to keep the current logo. Recommended size:
                  200x200px. Max size: 5MB
                </p>
                {imagePreview && (
                  <div className="relative w-48 h-48 border rounded-lg overflow-hidden mt-4 bg-white p-4 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    {imageFile && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={clearImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
                {imageFile && (
                  <p className="text-sm text-green-600">
                    ✓ New image selected. The old logo will be replaced.
                  </p>
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
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Image Change Warning */}
              {imageFile && (
                <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ You are uploading a new logo. The previous logo will be
                    permanently deleted from the server.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="cursor-pointer">
                  {updateMutation.isPending ? "Updating..." : "Update Brand"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/brands")}
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

export default EditBrand;
