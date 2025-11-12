import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import instance from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";
import * as z from "zod";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  wholeSalePrice: z.coerce.number().optional(),
  retailPrice: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  tags: z.string().optional(),
  sku: z.string().optional(),
  warranty: z.string().optional(),
  shipping: z.string().optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.coerce.number().min(1, "Minimum quantity is 1"),
  size: z.enum(["xs", "s", "m", "l", "xl", "xxl"]).optional(),
  color: z
    .enum([
      "red",
      "blue",
      "green",
      "yellow",
      "black",
      "white",
      "gray",
      "brown",
      "purple",
      "orange",
      "custom",
    ])
    .optional(),
  customColor: z.string().optional(),
  groupUnit: z.enum(["box", "pack", "set", "pair", "unit", "other"]),
  groupQuantity: z.coerce.number().min(1),
  unit: z.enum(["piece", "kg", "gram", "litre", "ml", "other"]),
  alertQuantity: z.coerce.number().min(5, "Alert quantity must be at least 5"),
  isActive: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

type Category = {
  _id: string;
  name: string;
};

type SubCategory = {
  _id: string;
  name: string;
  category: string;
};

type Brand = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  wholeSalePrice?: number;
  retailPrice?: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  thumbnail: {
    url: string;
    public_id: string;
  };
  images: Array<{
    url: string;
    public_id: string;
  }>;
  tags: string[];
  sku?: string;
  warranty?: string;
  shipping?: string;
  returnPolicy?: string;
  minimumOrderQuantity: number;
  size?: string;
  color?: string;
  customColor?: string;
  groupUnit: string;
  groupQuantity: number;
  unit: string;
  alertQuantity: number;
  isActive: boolean;
  isAvailable: boolean;
};

const EditProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{
      url: string;
      public_id: string;
    }>
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      wholeSalePrice: 0,
      retailPrice: 0,
      category: "",
      subCategory: "",
      brand: "",
      tags: "",
      sku: "",
      warranty: "",
      shipping: "",
      returnPolicy: "",
      minimumOrderQuantity: 1,
      size: "m",
      color: "black",
      customColor: "",
      groupUnit: "unit",
      groupQuantity: 1,
      unit: "piece",
      alertQuantity: 5,
      isActive: true,
      isAvailable: true,
    },
  });

  const selectedCategory = form.watch("category");
  const selectedColor = form.watch("color");

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await instance.get(`/product/product/${slug}`);
      const result = response.data;

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to fetch product");
      }

      return result.data;
    },
    enabled: !!slug,
  });

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        wholeSalePrice: product.wholeSalePrice || 0,
        retailPrice: product.retailPrice || 0,
        category: product.category._id,
        subCategory: product.subCategory?._id || "",
        brand: product.brand?._id || "",
        tags: product.tags?.join(", ") || "",
        sku: product.sku || "",
        warranty: product.warranty || "",
        shipping: product.shipping || "",
        returnPolicy: product.returnPolicy || "",
        minimumOrderQuantity: product.minimumOrderQuantity,
        size: product.size as any,
        color: product.color as any,
        customColor: product.customColor || "",
        groupUnit: product.groupUnit as any,
        groupQuantity: product.groupQuantity,
        unit: product.unit as any,
        alertQuantity: product.alertQuantity,
        isActive: product.isActive,
        isAvailable: product.isAvailable,
      });

      setThumbnailPreview(product.thumbnail.url);
      setExistingImages(product.images);
    }
  }, [product, form]);

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("/category/get-allCategory");
      return response.data.data;
    },
  });

  // Fetch subcategories
  const { data: subCategories } = useQuery<SubCategory[]>({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const response = await instance.get("/subcategory/get-allSubCategory");
      return response.data.data;
    },
  });

  // Fetch brands
  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await instance.get("/brand/all-brand");
      return response.data.data;
    },
  });

  // Filter subcategories by selected category
  const filteredSubCategories = subCategories?.filter(
    (sub) => sub.category === selectedCategory
  );

  // Handle thumbnail change
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setThumbnailFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle multiple images change
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + imageFiles.length + existingImages.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles([...imageFiles, ...validFiles]);
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Mark existing image for deletion
  const removeExistingImage = (publicId: string) => {
    setImagesToDelete([...imagesToDelete, publicId]);
    setExistingImages(
      existingImages.filter((img) => img.public_id !== publicId)
    );
  };

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const formData = new FormData();

      // Add all form fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("category", data.category);
      formData.append(
        "minimumOrderQuantity",
        data.minimumOrderQuantity.toString()
      );
      formData.append("groupUnit", data.groupUnit);
      formData.append("groupQuantity", data.groupQuantity.toString());
      formData.append("unit", data.unit);
      formData.append("alertQuantity", data.alertQuantity.toString());
      formData.append("isActive", data.isActive.toString());
      formData.append("isAvailable", data.isAvailable.toString());

      // Optional fields
      if (data.wholeSalePrice && data.wholeSalePrice > 0) {
        formData.append("wholeSalePrice", data.wholeSalePrice.toString());
      }
      if (data.retailPrice && data.retailPrice > 0) {
        formData.append("retailPrice", data.retailPrice.toString());
      }
      if (data.subCategory && data.subCategory.trim()) {
        formData.append("subCategory", data.subCategory);
      }
      if (data.brand && data.brand.trim()) {
        formData.append("brand", data.brand);
      }
      if (data.tags && data.tags.trim()) {
        const tagsArray = data.tags
          .split(" ", ",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        console.log(tagsArray);
        if (tagsArray.length > 0) {
          formData.append("tags", JSON.stringify(tagsArray));
        }
      }
      if (data.sku && data.sku.trim()) {
        formData.append("sku", data.sku);
      }
      if (data.warranty && data.warranty.trim()) {
        formData.append("warranty", data.warranty);
      }
      if (data.shipping && data.shipping.trim()) {
        formData.append("shipping", data.shipping);
      }
      if (data.returnPolicy && data.returnPolicy.trim()) {
        formData.append("returnPolicy", data.returnPolicy);
      }
      if (data.size && data.size.trim()) {
        formData.append("size", data.size);
      }
      if (data.color && data.color.trim()) {
        formData.append("color", data.color);
      }
      if (data.customColor && data.customColor.trim()) {
        formData.append("customColor", data.customColor);
      }

      // Add new thumbnail if changed
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      // Add new images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Add images to delete
      if (imagesToDelete.length > 0) {
        formData.append("deleteImages", JSON.stringify(imagesToDelete));
      }
      console.log(formData.entries());
      const response = await instance.patch(
        `/product/update-product/${slug}`,
        formData
      );
      const result = response.data;

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to update product");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      setTimeout(() => {
        navigate(`/dashboard/products/${slug}`);
      }, 1000);
    },
    onError: (error: any) => {
      console.error("Update product error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product";

      toast.error(message, {
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

  const onSubmit = async (data: ProductFormValues) => {
    if (existingImages.length + imageFiles.length === 0) {
      toast.error("Please keep or add at least one product image");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <p className="text-destructive text-center">Product not found</p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/dashboard/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
            <Button
              variant="ghost"
              onClick={() => navigate(`/dashboard/products/${slug}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          rows={5}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter SKU"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Images</h3>

                {/* Thumbnail */}
                <div className="space-y-2">
                  <FormLabel>Thumbnail Image *</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Current thumbnail or upload new one
                  </p>
                  {thumbnailPreview && (
                    <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Multiple Images */}
                <div className="space-y-2">
                  <FormLabel>Product Images * (Max 10)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    disabled={
                      isSubmitting ||
                      existingImages.length + imageFiles.length >= 10
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Manage existing images or upload new ones. Max: 10 images,
                    5MB each
                  </p>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Existing Images
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((image) => (
                          <div
                            key={image.public_id}
                            className="relative group border rounded-lg overflow-hidden aspect-square">
                            <img
                              src={image.url}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                removeExistingImage(image.public_id)
                              }>
                              <X className="h-4 w-4" />
                            </Button>
                            <Badge className="absolute bottom-2 left-2">
                              Existing
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {imagePreviews.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">New Images</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group border rounded-lg overflow-hidden aspect-square">
                            <img
                              src={preview}
                              alt={`New image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeNewImage(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Badge className="absolute bottom-2 left-2 bg-green-500">
                              New
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add More Button */}
                  {existingImages.length + imageFiles.length < 10 && (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {existingImages.length + imageFiles.length} / 10 images
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Stock</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wholeSalePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wholesale Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="retailPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retail Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Classification</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "none"}
                          disabled={isSubmitting || !selectedCategory}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sub category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {filteredSubCategories?.map((subCategory) => (
                              <SelectItem
                                key={subCategory._id}
                                value={subCategory._id}>
                                {subCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "none"}
                          disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {brands?.map((brand) => (
                              <SelectItem key={brand._id} value={brand._id}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Variant & Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specifications</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="xs">XS</SelectItem>
                            <SelectItem value="s">S</SelectItem>
                            <SelectItem value="m">M</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                            <SelectItem value="xl">XL</SelectItem>
                            <SelectItem value="xxl">XXL</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="yellow">Yellow</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="gray">Gray</SelectItem>
                            <SelectItem value="brown">Brown</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedColor === "custom" && (
                    <FormField
                      control={form.control}
                      name="customColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Color</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter custom color"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Units & Quantities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Units & Quantities</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="piece">Piece</SelectItem>
                            <SelectItem value="kg">Kilogram</SelectItem>
                            <SelectItem value="gram">Gram</SelectItem>
                            <SelectItem value="litre">Litre</SelectItem>
                            <SelectItem value="ml">Millilitre</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groupUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Unit *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="pack">Pack</SelectItem>
                            <SelectItem value="set">Set</SelectItem>
                            <SelectItem value="pair">Pair</SelectItem>
                            <SelectItem value="unit">Unit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groupQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumOrderQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alertQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Alert when stock falls below this
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="electronics, gadgets, smart (comma separated)"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="warranty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1 year warranty"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Info</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Free shipping"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="returnPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Policy</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="7 days return policy"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status Switches */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status</h3>

                <div className="flex gap-8">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Show this product on website
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

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Available</FormLabel>
                          <FormDescription>Product is in stock</FormDescription>
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
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/dashboard/products/${slug}`)}
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

export default EditProduct;
