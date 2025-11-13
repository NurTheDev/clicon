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
import { ArrowLeft, DollarSign, Percent, Tag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";

type DiscountFor = "all" | "category" | "subCategory" | "brand" | "product";
type DiscountType = "percentage" | "fixed";

type Discount = {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
  discountFor: DiscountFor;
  discountType: DiscountType;
  discountValue: number;
  startAt: string;
  endAt: string;
  category?: string[];
  subCategory?: string[];
  brand?: string[];
  product?: string[];
};

type Product = {
  _id: string;
  name: string;
  price: number;
  thumbnail?: { url: string };
};

type Category = { _id: string; name: string };
type SubCategory = { _id: string; name: string };
type Brand = { _id: string; name: string };

type FormData = {
  name: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  discountFor: DiscountFor;
  discountType: DiscountType;
  discountValue: number;
  category: string[];
  subCategory: string[];
  brand: string[];
  product: string[];
};

const toLocalDatetime = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const EditDiscount = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    startAt: "",
    endAt: "",
    isActive: true,
    discountFor: "product",
    discountType: "percentage",
    discountValue: 0,
    category: [],
    subCategory: [],
    brand: [],
    product: [],
  });

  const [loadedDiscount, setLoadedDiscount] = useState<Discount | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // Fetch existing discount
  const {
    data: discount,
    isLoading: loadingDiscount,
    isError: discountError,
    refetch: refetchDiscount,
  } = useQuery<Discount | null>({
    queryKey: ["discount", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await instance.get(`/discount/get-discount/${slug}`);
      return res.data?.data ?? null;
    },
  });

  // Fetch lists
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products-for-edit-discount"],
    queryFn: async () => {
      const res = await instance.get("/product/get-allProduct?limit=1000");
      return res.data?.data?.products || [];
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/category/get-allCategory");
      return res.data?.data || [];
    },
  });

  const { data: subCategories = [] } = useQuery<SubCategory[]>({
    queryKey: ["subCategories"],
    queryFn: async () => {
      const res = await instance.get("/subcategory/get-allSubCategory");
      return res.data?.data || [];
    },
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await instance.get("/brand/all-brand");
      return res.data?.data || [];
    },
  });

  // Initialize form when discount loads
  useEffect(() => {
    if (discount) {
      setLoadedDiscount(discount);
      setFormData({
        name: discount.name,
        startAt: toLocalDatetime(discount.startAt),
        endAt: toLocalDatetime(discount.endAt),
        isActive: discount.isActive ?? true,
        discountFor: discount.discountFor,
        discountType: discount.discountType,
        discountValue: discount.discountValue,
        category: discount.category || [],
        subCategory: discount.subCategory || [],
        brand: discount.brand || [],
        product: discount.product || [],
      });
    }
  }, [discount]);

  // Filter products
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
          !formData.product.includes(p._id)
      ),
    [products, productSearch, formData.product]
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };
  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value as any,
    }));
  };
  const handleDiscountForChange = (value: DiscountFor) => {
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
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const toggleItem = (
    field: "category" | "subCategory" | "brand",
    id: string
  ) => {
    setFormData((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  const addProduct = (id: string) => {
    if (!formData.product.includes(id)) {
      setFormData((prev) => ({ ...prev, product: [...prev.product, id] }));
      setProductSearch("");
    }
  };
  const removeProduct = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      product: prev.product.filter((x) => x !== id),
    }));
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!loadedDiscount) throw new Error("No discount loaded");
      const payload: any = {
        name: data.name,
        startAt: data.startAt,
        endAt: data.endAt,
        discountFor: data.discountFor,
        discountType: data.discountType,
        discountValue: data.discountValue,
      };
      // Include isActive only if backend supports it; comment out if not in validator
      if (loadedDiscount.isActive !== undefined) {
        payload.isActive = data.isActive;
      }
      if (data.discountFor === "category") payload.category = data.category;
      if (data.discountFor === "subCategory")
        payload.subCategory = data.subCategory;
      if (data.discountFor === "brand") payload.brand = data.brand;
      if (data.discountFor === "product") payload.product = data.product;

      const res = await instance.put(
        `/discount/update-discount/${loadedDiscount.slug}`,
        payload
      );
      if (res.data?.status !== "success") {
        throw new Error(res.data?.message || "Update failed");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      toast.success("Discount updated", {
        position: "top-right",
        transition: Bounce,
      });
      qc.invalidateQueries({ queryKey: ["discounts"] });
      refetchDiscount();
    },
    onError: (e: any) =>
      toast.error(e.message || "Update failed", {
        position: "top-right",
        transition: Bounce,
      }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name required");
      return;
    }
    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      toast.error("Percentage cannot exceed 100");
      return;
    }
    if (formData.discountValue <= 0) {
      toast.error("Value must be > 0");
      return;
    }
    if (!formData.startAt || !formData.endAt) {
      toast.error("Start/End required");
      return;
    }
    if (new Date(formData.startAt) >= new Date(formData.endAt)) {
      toast.error("End must be after Start");
      return;
    }
    if (formData.discountFor === "category" && formData.category.length === 0) {
      toast.error("Select at least one category");
      return;
    }
    if (
      formData.discountFor === "subCategory" &&
      formData.subCategory.length === 0
    ) {
      toast.error("Select at least one sub-category");
      return;
    }
    if (formData.discountFor === "brand" && formData.brand.length === 0) {
      toast.error("Select at least one brand");
      return;
    }
    if (formData.discountFor === "product" && formData.product.length === 0) {
      toast.error("Select at least one product");
      return;
    }
    updateMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate("/dashboard/discounts")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {loadedDiscount && (
          <Button
            variant="outline"
            onClick={() => refetchDiscount()}
            disabled={loadingDiscount}>
            Refresh
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {loadedDiscount ? `Edit: ${loadedDiscount.name}` : "Edit Discount"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingDiscount && (
            <p className="text-sm text-muted-foreground py-6">Loading...</p>
          )}
          {discountError && (
            <p className="text-sm text-destructive py-6">
              Failed to load discount.
            </p>
          )}
          {!loadingDiscount && loadedDiscount && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Sale name"
                    required
                  />
                </div>
                {loadedDiscount.isActive !== undefined && (
                  <div className="space-y-2">
                    <Label htmlFor="isActive">Status</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={handleSwitchChange}
                      />
                      <span className="text-sm">
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Config */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(v) =>
                      handleSelectChange("discountType", v)
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
                          Fixed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Value <span className="text-destructive">*</span>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Scope <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.discountFor}
                    onValueChange={(v) =>
                      handleDiscountForChange(v as DiscountFor)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="category">Categories</SelectItem>
                      <SelectItem value="subCategory">
                        Sub-Categories
                      </SelectItem>
                      <SelectItem value="brand">Brands</SelectItem>
                      <SelectItem value="product">Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startAt">
                    Start <span className="text-destructive">*</span>
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
                    End <span className="text-destructive">*</span>
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

              {/* Conditional selection */}
              {formData.discountFor !== "all" && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-sm">
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
                    {formData.discountFor === "category" && (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <Badge
                            key={c._id}
                            variant={
                              formData.category.includes(c._id)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleItem("category", c._id)}>
                            {c.name}
                            {formData.category.includes(c._id) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {formData.discountFor === "subCategory" && (
                      <div className="flex flex-wrap gap-2">
                        {subCategories.map((s) => (
                          <Badge
                            key={s._id}
                            variant={
                              formData.subCategory.includes(s._id)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleItem("subCategory", s._id)}>
                            {s.name}
                            {formData.subCategory.includes(s._id) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {formData.discountFor === "brand" && (
                      <div className="flex flex-wrap gap-2">
                        {brands.map((b) => (
                          <Badge
                            key={b._id}
                            variant={
                              formData.brand.includes(b._id)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleItem("brand", b._id)}>
                            {b.name}
                            {formData.brand.includes(b._id) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {formData.discountFor === "product" && (
                      <div className="space-y-4">
                        <Input
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                        />
                        {productSearch && filteredProducts.length > 0 && (
                          <div className="border rounded p-2 max-h-64 overflow-y-auto space-y-1">
                            {filteredProducts.slice(0, 12).map((p) => (
                              <div
                                key={p._id}
                                onClick={() => addProduct(p._id)}
                                className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-muted">
                                <span className="text-sm truncate">
                                  {p.name}
                                </span>
                                <Badge variant="outline">
                                  ${p.price.toFixed(2)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                        {formData.product.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Selected Products ({formData.product.length})
                            </p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {formData.product.map((id) => {
                                const p = products.find((x) => x._id === id);
                                if (!p) return null;
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center justify-between border rounded p-2">
                                    <span className="text-sm truncate">
                                      {p.name}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeProduct(id)}>
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
                    <div className="text-xs text-muted-foreground">
                      {formData.discountFor === "category" &&
                        formData.category.length}{" "}
                      {formData.discountFor === "subCategory" &&
                        formData.subCategory.length}{" "}
                      {formData.discountFor === "brand" &&
                        formData.brand.length}{" "}
                      {formData.discountFor === "product" &&
                        formData.product.length}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/discounts")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Discount"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDiscount;
