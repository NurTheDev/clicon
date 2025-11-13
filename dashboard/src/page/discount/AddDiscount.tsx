import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import instance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, DollarSign, Percent, Tag, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: {
    url: string;
  };
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  category: string;
};

type Brand = {
  _id: string;
  name: string;
  slug: string;
};

type DiscountFormData = {
  name: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  discountFor: "all" | "category" | "subCategory" | "brand" | "product";
  discountType: "percentage" | "fixed";
  discountValue: number;
  category: string[];
  subCategory: string[];
  brand: string[];
  product: string[];
};

// Helper to format Date for <input type="datetime-local" />
const toLocalDatetime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${mi}`;
};

const AddDiscount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<DiscountFormData>({
    name: "",
    startAt: toLocalDatetime(new Date()),
    endAt: toLocalDatetime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    isActive: true,
    discountFor: "product",
    discountType: "percentage",
    discountValue: 0,
    category: [],
    subCategory: [],
    brand: [],
    product: [],
  });

  const [productSearch, setProductSearch] = useState("");

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products-for-discount"],
    queryFn: async () => {
      const response = await instance.get("/product/get-allProduct?limit=1000");
      return response.data.data.products;
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("/category/get-allCategory");
      return response.data.data;
    },
  });

  // Fetch sub-categories
  const { data: subCategories = [] } = useQuery<SubCategory[]>({
    queryKey: ["subCategories"],
    queryFn: async () => {
      const response = await instance.get("/subcategory/get-allSubCategory");
      return response.data.data;
    },
  });

  // Fetch brands
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await instance.get("/brand/all-brand");
      return response.data.data;
    },
  });

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !formData.product.includes(product._id)
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiscountForChange = (value: DiscountFormData["discountFor"]) => {
    setFormData((prev) => ({
      ...prev,
      discountFor: value,
      category: [],
      subCategory: [],
      brand: [],
      product: [],
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter((id) => id !== categoryId)
        : [...prev.category, categoryId],
    }));
  };

  const toggleSubCategory = (subCategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.includes(subCategoryId)
        ? prev.subCategory.filter((id) => id !== subCategoryId)
        : [...prev.subCategory, subCategoryId],
    }));
  };

  const toggleBrand = (brandId: string) => {
    setFormData((prev) => ({
      ...prev,
      brand: prev.brand.includes(brandId)
        ? prev.brand.filter((id) => id !== brandId)
        : [...prev.brand, brandId],
    }));
  };

  const addProduct = (productId: string) => {
    if (!formData.product.includes(productId)) {
      setFormData((prev) => ({
        ...prev,
        product: [...prev.product, productId],
      }));
      setProductSearch("");
    }
  };

  const removeProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      product: prev.product.filter((id) => id !== productId),
    }));
  };

  // Create discount mutation
  const createMutation = useMutation({
    mutationFn: async (data: DiscountFormData) => {
      const payload: any = {
        name: data.name,
        startAt: data.startAt,
        endAt: data.endAt,
        isActive: data.isActive,
        discountFor: data.discountFor,
        discountType: data.discountType,
        discountValue: data.discountValue,
      };

      if (data.discountFor === "category") {
        payload.category = data.category;
      } else if (data.discountFor === "subCategory") {
        payload.subCategory = data.subCategory;
      } else if (data.discountFor === "brand") {
        payload.brand = data.brand;
      } else if (data.discountFor === "product") {
        payload.product = data.product;
      }

      const response = await instance.post(
        "/discount/create-discount",
        payload
      );
      const result = response.data;

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to create discount");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });

      toast.success("Discount created successfully!", {
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
        navigate("/dashboard/discounts");
      }, 1000);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create discount";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Discount name is required");
      return;
    }

    // Validate based on discountFor
    if (formData.discountFor === "category" && formData.category.length === 0) {
      toast.error("Please select at least one category");
      return;
    }
    if (
      formData.discountFor === "subCategory" &&
      formData.subCategory.length === 0
    ) {
      toast.error("Please select at least one subcategory");
      return;
    }
    if (formData.discountFor === "brand" && formData.brand.length === 0) {
      toast.error("Please select at least one brand");
      return;
    }
    if (formData.discountFor === "product" && formData.product.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    // Validate discount value
    if (formData.discountValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    // Validate dates
    if (!formData.startAt || !formData.endAt) {
      toast.error("Please provide both start and end date");
      return;
    }
    if (new Date(formData.startAt) >= new Date(formData.endAt)) {
      toast.error("End date must be after start date");
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/discounts")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Discounts
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Discount Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Summer Sale 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discount Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Discount Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">
                  Discount Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) =>
                    handleSelectChange("discountType", value)
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Percentage (%)
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fixed Amount ($)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  max={
                    formData.discountType === "percentage" ? "100" : undefined
                  }
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  value={formData.discountValue}
                  onChange={handleNumberChange}
                  placeholder={
                    formData.discountType === "percentage" ? "10" : "50.00"
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountFor">
                  Apply Discount To <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.discountFor}
                  onValueChange={(value) =>
                    handleDiscountForChange(
                      value as DiscountFormData["discountFor"]
                    )
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="category">
                      Specific Categories
                    </SelectItem>
                    <SelectItem value="subCategory">
                      Specific Sub-Categories
                    </SelectItem>
                    <SelectItem value="brand">Specific Brands</SelectItem>
                    <SelectItem value="product">Specific Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validity Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Validity Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAt">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startAt"
                  name="startAt"
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endAt">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endAt"
                  name="endAt"
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicable Items Based on discountFor */}
        {formData.discountFor !== "all" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Select{" "}
                {formData.discountFor === "category"
                  ? "Categories"
                  : formData.discountFor === "subCategory"
                  ? "Sub-Categories"
                  : formData.discountFor === "brand"
                  ? "Brands"
                  : "Products"}{" "}
                <span className="text-destructive">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Categories */}
              {formData.discountFor === "category" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category._id}
                        variant={
                          formData.category.includes(category._id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => toggleCategory(category._id)}>
                        {category.name}
                        {formData.category.includes(category._id) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.category.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {formData.category.length} categor
                      {formData.category.length === 1 ? "y" : "ies"} selected
                    </p>
                  )}
                </div>
              )}

              {/* Sub-Categories */}
              {formData.discountFor === "subCategory" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {subCategories.map((subCategory) => (
                      <Badge
                        key={subCategory._id}
                        variant={
                          formData.subCategory.includes(subCategory._id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => toggleSubCategory(subCategory._id)}>
                        {subCategory.name}
                        {formData.subCategory.includes(subCategory._id) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.subCategory.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {formData.subCategory.length} sub-categor
                      {formData.subCategory.length === 1 ? "y" : "ies"} selected
                    </p>
                  )}
                </div>
              )}

              {/* Brands */}
              {formData.discountFor === "brand" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <Badge
                        key={brand._id}
                        variant={
                          formData.brand.includes(brand._id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => toggleBrand(brand._id)}>
                        {brand.name}
                        {formData.brand.includes(brand._id) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.brand.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {formData.brand.length} brand
                      {formData.brand.length === 1 ? "" : "s"} selected
                    </p>
                  )}
                </div>
              )}

              {/* Products */}
              {formData.discountFor === "product" && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>

                  {/* Search Results */}
                  {productSearch && filteredProducts.length > 0 && (
                    <div className="border rounded-lg p-2 max-h-64 overflow-y-auto">
                      {filteredProducts.slice(0, 10).map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => addProduct(product._id)}>
                          <div className="flex items-center gap-2">
                            <img
                              src={product.thumbnail.url}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected Products */}
                  {formData.product.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Selected Products ({formData.product.length})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formData.product.map((productId) => {
                          const product = products.find(
                            (p) => p._id === productId
                          );
                          if (!product) return null;
                          return (
                            <div
                              key={productId}
                              className="flex items-center justify-between border rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={product.thumbnail.url}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                  <p className="text-sm font-medium">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${product.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProduct(productId)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/discounts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Discount"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDiscount;
