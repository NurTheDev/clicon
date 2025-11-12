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
import { Textarea } from "@/components/ui/textarea";
import instance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Percent,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";

type Product = {
  _id: string;
  name: string;
  slug: string;
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
};

type Brand = {
  _id: string;
  name: string;
  slug: string;
};

type CouponFormData = {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount: number;
  minPurchaseAmount: number;
  startDate: string;
  endDate: string;
  usageLimitPerUser: number;
  usageLimitTotal: number;
  isActive: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  applicableSubCategories: string[];
  applicableBrands: string[];
};

const CreateCoupon = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    maxDiscountAmount: 0,
    minPurchaseAmount: 0,
    startDate: "",
    endDate: "",
    usageLimitPerUser: 1,
    usageLimitTotal: 100,
    isActive: true,
    applicableProducts: [],
    applicableCategories: [],
    applicableSubCategories: [],
    applicableBrands: [],
  });

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get("/product/products");
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
      const response = await instance.get("/subCategory/get-allSubCategories");
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const response = await instance.post("/coupon/create-coupon", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });

      toast.success("Coupon created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      navigate("/dashboard/coupons");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create coupon";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  // Add product
  const addProduct = () => {
    if (
      selectedProduct &&
      !formData.applicableProducts.includes(selectedProduct)
    ) {
      setFormData((prev) => ({
        ...prev,
        applicableProducts: [...prev.applicableProducts, selectedProduct],
      }));
      setSelectedProduct("");
    }
  };

  // Remove product
  const removeProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableProducts: prev.applicableProducts.filter(
        (id) => id !== productId
      ),
    }));
  };

  // Add category
  const addCategory = () => {
    if (
      selectedCategory &&
      !formData.applicableCategories.includes(selectedCategory)
    ) {
      setFormData((prev) => ({
        ...prev,
        applicableCategories: [...prev.applicableCategories, selectedCategory],
      }));
      setSelectedCategory("");
    }
  };

  // Remove category
  const removeCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableCategories: prev.applicableCategories.filter(
        (id) => id !== categoryId
      ),
    }));
  };

  // Add sub-category
  const addSubCategory = () => {
    if (
      selectedSubCategory &&
      !formData.applicableSubCategories.includes(selectedSubCategory)
    ) {
      setFormData((prev) => ({
        ...prev,
        applicableSubCategories: [
          ...prev.applicableSubCategories,
          selectedSubCategory,
        ],
      }));
      setSelectedSubCategory("");
    }
  };

  // Remove sub-category
  const removeSubCategory = (subCategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableSubCategories: prev.applicableSubCategories.filter(
        (id) => id !== subCategoryId
      ),
    }));
  };

  // Add brand
  const addBrand = () => {
    if (selectedBrand && !formData.applicableBrands.includes(selectedBrand)) {
      setFormData((prev) => ({
        ...prev,
        applicableBrands: [...prev.applicableBrands, selectedBrand],
      }));
      setSelectedBrand("");
    }
  };

  // Remove brand
  const removeBrand = (brandId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableBrands: prev.applicableBrands.filter((id) => id !== brandId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/coupons")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Coupons
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
                <Label htmlFor="code">
                  Coupon Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="SUMMER2024"
                  required
                  className="uppercase"
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter coupon description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discount Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Discount Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Percentage
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fixed Amount
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
                  value={formData.discountValue}
                  onChange={handleNumberChange}
                  placeholder={
                    formData.discountType === "percentage" ? "10" : "100"
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.discountType === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscountAmount">
                    Max Discount Amount{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="maxDiscountAmount"
                    name="maxDiscountAmount"
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount}
                    onChange={handleNumberChange}
                    placeholder="50"
                    required={formData.discountType === "percentage"}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="minPurchaseAmount">
                  Minimum Purchase Amount
                </Label>
                <Input
                  id="minPurchaseAmount"
                  name="minPurchaseAmount"
                  type="number"
                  min="0"
                  value={formData.minPurchaseAmount}
                  onChange={handleNumberChange}
                  placeholder="0"
                />
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
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usage Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimitPerUser">
                  Usage Limit Per User{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="usageLimitPerUser"
                  name="usageLimitPerUser"
                  type="number"
                  min="1"
                  value={formData.usageLimitPerUser}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimitTotal">Total Usage Limit</Label>
                <Input
                  id="usageLimitTotal"
                  name="usageLimitTotal"
                  type="number"
                  min="1"
                  value={formData.usageLimitTotal}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicable Products */}
        <Card>
          <CardHeader>
            <CardTitle>Applicable Products (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addProduct}
                disabled={!selectedProduct}>
                Add
              </Button>
            </div>

            {formData.applicableProducts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.applicableProducts.map((productId) => {
                  const product = products.find((p) => p._id === productId);
                  return (
                    <div
                      key={productId}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                      <span>{product?.name}</span>
                      <button
                        type="button"
                        onClick={() => removeProduct(productId)}
                        className="ml-1 hover:bg-destructive/10 rounded-full p-0.5 transition-colors">
                        <X className="h-3 w-3 hover:text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applicable Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Applicable Categories (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addCategory}
                disabled={!selectedCategory}>
                Add
              </Button>
            </div>

            {formData.applicableCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.applicableCategories.map((categoryId) => {
                  const category = categories.find((c) => c._id === categoryId);
                  return (
                    <div
                      key={categoryId}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                      <span>{category?.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(categoryId)}
                        className="ml-1 hover:bg-destructive/10 rounded-full p-0.5 transition-colors">
                        <X className="h-3 w-3 hover:text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applicable Sub-Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Applicable Sub-Categories (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select
                value={selectedSubCategory}
                onValueChange={setSelectedSubCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addSubCategory}
                disabled={!selectedSubCategory}>
                Add
              </Button>
            </div>

            {formData.applicableSubCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.applicableSubCategories.map((subCategoryId) => {
                  const subCategory = subCategories.find(
                    (sc) => sc._id === subCategoryId
                  );
                  return (
                    <div
                      key={subCategoryId}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                      <span>{subCategory?.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSubCategory(subCategoryId)}
                        className="ml-1 hover:bg-destructive/10 rounded-full p-0.5 transition-colors">
                        <X className="h-3 w-3 hover:text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applicable Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Applicable Brands (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addBrand}
                disabled={!selectedBrand}>
                Add
              </Button>
            </div>

            {formData.applicableBrands.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.applicableBrands.map((brandId) => {
                  const brand = brands.find((b) => b._id === brandId);
                  return (
                    <div
                      key={brandId}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                      <span>{brand?.name}</span>
                      <button
                        type="button"
                        onClick={() => removeBrand(brandId)}
                        className="ml-1 hover:bg-destructive/10 rounded-full p-0.5 transition-colors">
                        <X className="h-3 w-3 hover:text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/coupons")}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
