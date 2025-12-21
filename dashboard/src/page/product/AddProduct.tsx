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
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import React, { useState } from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import { useNavigate } from "react-router";
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
    variantType: z.enum(["single", "multiple"]),
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

const AddProduct: React.FC = () => {
    const navigate = useNavigate();
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
            variantType: "single",
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
    const variantType = form.watch("variantType");

    const { data: categories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await instance.get("/category/get-allCategory");
            return response.data.data;
        },
    });

    const { data: subCategories } = useQuery<SubCategory[]>({
        queryKey: ["subcategories"],
        queryFn: async () => {
            const response = await instance.get("/subCategory/get-allSubCategory");
            return response.data.data;
        },
    });

    const { data: brands } = useQuery<Brand[]>({
        queryKey: ["brands"],
        queryFn: async () => {
            const response = await instance.get("/brand/all-brand");
            return response.data.data;
        },
    });

    const filteredSubCategories = subCategories?.filter(
        (sub) => sub.category === selectedCategory
    );

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

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + imageFiles.length > 10) {
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
                    setImagePreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setImageFiles((prev) => [...prev, ...validFiles]);
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const createMutation = useMutation({
        mutationFn: async (data: ProductFormValues) => {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());
            formData.append("stock", data.stock.toString());
            formData.append("category", data.category);
            formData.append("minimumOrderQuantity", data.minimumOrderQuantity.toString());
            formData.append("variantType", data.variantType);
            formData.append("groupUnit", data.groupUnit);
            formData.append("groupQuantity", data.groupQuantity.toString());
            formData.append("unit", data.unit);
            formData.append("alertQuantity", data.alertQuantity.toString());
            formData.append("isActive", data.isActive.toString());
            formData.append("isAvailable", (data.isAvailable ?? true).toString());

            if (data.wholeSalePrice)
                formData.append("wholeSalePrice", data.wholeSalePrice.toString());
            if (data.retailPrice)
                formData.append("retailPrice", data.retailPrice.toString());
            if (data.subCategory) formData.append("subCategory", data.subCategory);
            if (data.brand) formData.append("brand", data.brand);
            if (data.tags) {
                const tagsArray = data.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);
                tagsArray.forEach((tag) => {
                    formData.append("tags[]", tag);
                });
            }
            if (data.sku) formData.append("sku", data.sku);
            if (data.warranty) formData.append("warranty", data.warranty);
            if (data.shipping) formData.append("shipping", data.shipping);
            if (data.returnPolicy) formData.append("returnPolicy", data.returnPolicy);

            // Only include size/color for single variant products
            if (data.variantType === "single") {
                if (data.size) formData.append("size", data.size);
                if (data.color) formData.append("color", data.color);
                if (data.customColor) formData.append("customColor", data.customColor);
            }

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            const response = await instance.post("/product/create-product", formData);
            const result = response.data;

            if (result.status !== "success") {
                throw new Error(result.message || "Failed to create product");
            }

            return result.data;
        },
        onSuccess: () => {
            toast.success("Product created successfully!", {
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
                navigate("/dashboard/products");
            }, 1000);
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create product";
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

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        if (!thumbnailFile) {
            toast.error("Please select a thumbnail image");
            return;
        }

        if (imageFiles.length === 0) {
            toast.error("Please select at least one product image");
            return;
        }

        setIsSubmitting(true);
        try {
            await createMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
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
                                                <Input placeholder="Enter product name" {...field} disabled={isSubmitting} />
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
                                                <Textarea placeholder="Enter product description" rows={5} {...field} disabled={isSubmitting} />
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
                                                <Input placeholder="Enter SKU" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Product Images</h3>

                                <div className="space-y-2">
                                    <FormLabel>Thumbnail Image *</FormLabel>
                                    <Input type="file" accept="image/*" onChange={handleThumbnailChange} disabled={isSubmitting} />
                                    <p className="text-sm text-muted-foreground">Main product image. Recommended: 800x800px, Max: 5MB</p>
                                    {thumbnailPreview && (
                                        <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                                            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <FormLabel>Product Images * (Max 10)</FormLabel>
                                    <Input type="file" accept="image/*" multiple onChange={handleImagesChange} disabled={isSubmitting || imageFiles.length >= 10} />
                                    <p className="text-sm text-muted-foreground">Additional product images. Max: 10 images, 5MB each</p>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group border rounded-lg overflow-hidden aspect-square">
                                                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    <Badge className="absolute bottom-2 left-2">{index + 1}</Badge>
                                                </div>
                                            ))}
                                            {imageFiles.length < 10 && (
                                                <div className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center text-muted-foreground">
                                                    <div className="text-center">
                                                        <ImagePlus className="h-8 w-8 mx-auto mb-2" />
                                                        <p className="text-sm">Add more</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Pricing & Stock</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="price" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price *</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="stock" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="wholeSalePrice" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Wholesale Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="retailPrice" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Retail Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Classification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="category" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="subCategory" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sub Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || !selectedCategory}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select sub category" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredSubCategories?.map((subCategory) => (
                                                        <SelectItem key={subCategory._id} value={subCategory._id}>{subCategory.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="brand" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {brands?.map((brand) => (
                                                        <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            {/* Variant Type Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Variant Configuration</h3>
                                <FormField control={form.control} name="variantType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variant Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="single">Single Variant</SelectItem>
                                                <SelectItem value="multiple">Multiple Variants</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {variantType === "single"
                                                ? "Product has one size/color combination"
                                                : "Product has multiple size/color combinations (add variants after creating product)"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Show size/color only for single variant */}
                                {variantType === "single" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                        <FormField control={form.control} name="size" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Size</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                                        )} />

                                        <FormField control={form.control} name="color" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Color</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                                        )} />

                                        {selectedColor === "custom" && (
                                            <FormField control={form.control} name="customColor" render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Custom Color</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter custom color" {...field} disabled={isSubmitting} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        )}
                                    </div>
                                )}

                                {variantType === "multiple" && (
                                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            <strong>Note:</strong> After creating this product, you can add multiple variants with different sizes, colors, prices, and stock levels from the product details page.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Units & Quantities */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Units & Quantities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="unit" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                                    )} />

                                    <FormField control={form.control} name="groupUnit" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Group Unit *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                                    )} />

                                    <FormField control={form.control} name="groupQuantity" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Group Quantity *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="1" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="minimumOrderQuantity" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Minimum Order Quantity *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="1" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="alertQuantity" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alert Quantity *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="5" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormDescription>Alert when stock falls below this</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Additional Information</h3>

                                <FormField control={form.control} name="tags" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input placeholder="electronics, gadgets, smart (comma separated)" {...field} disabled={isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="warranty" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Warranty</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1 year warranty" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="shipping" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shipping Info</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Free shipping" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <FormField control={form.control} name="returnPolicy" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Return Policy</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="7 days return policy" {...field} disabled={isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Status Switches */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Status</h3>
                                <div className="flex gap-8">
                                    <FormField control={form.control} name="isActive" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Active</FormLabel>
                                                <FormDescription>Show this product on website</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                                            </FormControl>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="isAvailable" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Available</FormLabel>
                                                <FormDescription>Product is in stock</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                    {isSubmitting ? "Creating Product..." : "Create Product"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => {
                                    form.reset();
                                    setThumbnailFile(null);
                                    setThumbnailPreview("");
                                    setImageFiles([]);
                                    setImagePreviews([]);
                                }} disabled={isSubmitting} className="cursor-pointer">
                                    Reset
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => navigate("/dashboard/products")} disabled={isSubmitting} className="cursor-pointer">
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

export default AddProduct;
