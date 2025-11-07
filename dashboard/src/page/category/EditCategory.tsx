import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

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

const EditCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  // Fetch category data
  const { data: category, isLoading: isFetchingCategory } = useQuery<Category>({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/get-category/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!slug,
  });
  console.log(category);
  // Populate form with category data
  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("isActive", category.isActive);
      setImagePreview(category.image.url);
    }
  }, [category, setValue]);

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/update-category/${category?.slug}`,
        {
          method: "PATCH",
          body: data,
        }
      );
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to update category");
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", slug] });

      toast.success("Category updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      // Navigate to the new slug if it changed
      const newSlug = result.data?.slug || slug;
      navigate(`/dashboard/categories/${newSlug}`);
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

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("isActive", data.isActive.toString());
    console.log("press");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    updateMutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(category?.image.url || "");
  };

  if (isFetchingCategory) {
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

  if (!category) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Category not found
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/dashboard/categories")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/dashboard/categories/${slug}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground">
            Update category information and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the category name (slug will be auto-generated)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter category name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                The slug will be automatically generated from the category name
              </p>
            </div>

            {/* Show current slug */}
            <div className="space-y-2">
              <Label>Current Slug</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="text-sm font-mono">{category.slug}</code>
              </div>
              <p className="text-xs text-muted-foreground">
                This will update automatically when you change the name
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Image */}
        <Card>
          <CardHeader>
            <CardTitle>Category Image</CardTitle>
            <CardDescription>
              Upload a new image or keep the existing one (Optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}>
                  <X className="h-4 w-4" />
                </Button>
                {!imageFile && (
                  <div className="mt-2">
                    <Label htmlFor="image-update" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                        <Upload className="h-4 w-4" />
                        Change Image
                      </div>
                      <Input
                        id="image-update"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </Label>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      <Upload className="h-4 w-4" />
                      Choose File
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage category visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Make this category visible on the storefront
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/dashboard/categories/${slug}`)}
            disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Category"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
