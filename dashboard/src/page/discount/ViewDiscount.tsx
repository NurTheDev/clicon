import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import instance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Percent,
  Timer,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";

type Discount = {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
  discountFor: "all" | "category" | "subCategory" | "brand" | "product";
  discountType: "percentage" | "fixed";
  discountValue: number;
  startAt: string;
  endAt: string;
  category?: string[];
  subCategory?: string[];
  brand?: string[];
  product?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type NamedItem = { _id: string; name: string; slug?: string };

const fmt = (v?: string) => {
  if (!v) return "-";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

const lifecycle = (d?: Discount) => {
  if (!d) return "";
  const now = Date.now();
  const start = new Date(d.startAt).getTime();
  const end = new Date(d.endAt).getTime();
  if (end && end < now) return "Expired";
  if (start && start > now) return "Scheduled";
  return "Live";
};

const ViewDiscount = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    data: discount,
    isLoading,
    isError,
    refetch,
  } = useQuery<Discount | null>({
    queryKey: ["discount", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await instance.get(`/discount/get-discount/${slug}`);
      // success(res, message, data, statusCode)
      return res.data?.data ?? null;
    },
  });

  // Fetch collections for resolving names
  const { data: categories = [] } = useQuery<NamedItem[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await instance.get("/category/get-allCategory");
      return r.data?.data || [];
    },
  });
  const { data: subCategories = [] } = useQuery<NamedItem[]>({
    queryKey: ["subCategories"],
    queryFn: async () => {
      const r = await instance.get("/subcategory/get-allSubCategory");
      return r.data?.data || [];
    },
  });
  const { data: brands = [] } = useQuery<NamedItem[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const r = await instance.get("/brand/all-brand");
      return r.data?.data || [];
    },
  });
  const { data: products = [] } = useQuery<NamedItem[]>({
    queryKey: ["products-mini"],
    queryFn: async () => {
      const r = await instance.get(
        "/product/get-allProduct?limit=1000&fields=_id,name,slug"
      );
      return r.data?.data?.products || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`/discount/delete-discount/${slug}`);
      if (res.data?.status !== "success") {
        throw new Error(res.data?.message || "Delete failed");
      }
    },
    onSuccess: () => {
      toast.success("Discount deleted", {
        position: "top-right",
        transition: Bounce,
      });
      qc.invalidateQueries({ queryKey: ["discounts"] });
      navigate("/dashboard/discounts");
    },
    onError: (e: any) =>
      toast.error(e?.message || "Delete failed", {
        position: "top-right",
        transition: Bounce,
      }),
  });

  const scopeItems = useMemo(() => {
    if (!discount) return [];
    const mapName = (ids: string[] | undefined, pool: NamedItem[]) =>
      (ids || []).map((id) => pool.find((p) => p._id === id)?.name || id);

    switch (discount.discountFor) {
      case "category":
        return mapName(discount.category, categories);
      case "subCategory":
        return mapName(discount.subCategory, subCategories);
      case "brand":
        return mapName(discount.brand, brands);
      case "product":
        return mapName(discount.product, products);
      default:
        return [];
    }
  }, [discount, categories, subCategories, brands, products]);

  useEffect(() => {
    if (!isLoading && !discount && !isError && slug) {
      toast.info("Discount not found", { position: "top-right" });
    }
  }, [discount, isLoading, isError, slug]);

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}>
            Refresh
          </Button>
          {discount && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/discounts/edit/${discount.slug}`)
                }
                className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm("Delete this discount?"))
                    deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
                className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            {isLoading ? "Loading..." : discount?.name || "Not Found"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Fetching discount...
            </p>
          )}
          {isError && (
            <p className="text-sm text-destructive">Failed to load discount.</p>
          )}
          {!isLoading && discount && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Slug
                  </p>
                  <p className="font-medium break-all">/{discount.slug}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Discount Type
                  </p>
                  <Badge variant="outline" className="capitalize">
                    {discount.discountType}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Value
                  </p>
                  <p className="font-medium">
                    {discount.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `$${Number(discount.discountValue).toFixed(2)}`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Lifecycle
                  </p>
                  <Badge variant="outline">{lifecycle(discount)}</Badge>
                </div>
                {typeof discount.isActive === "boolean" && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">
                      Active
                    </p>
                    <Badge
                      className="capitalize"
                      variant={discount.isActive ? "default" : "outline"}>
                      {discount.isActive ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground">
                    Scope
                  </p>
                  <Badge variant="outline" className="capitalize">
                    {discount.discountFor === "all"
                      ? "All Products"
                      : discount.discountFor}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Start
                  </div>
                  <p className="font-medium">{fmt(discount.startAt)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                    <Calendar className="h-3 w-3" /> End
                  </div>
                  <p className="font-medium">{fmt(discount.endAt)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                    <Timer className="h-3 w-3" /> Created
                  </div>
                  <p className="font-medium">{fmt(discount.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                    <Timer className="h-3 w-3" /> Updated
                  </div>
                  <p className="font-medium">{fmt(discount.updatedAt)}</p>
                </div>
              </div>

              {discount.discountFor !== "all" && (
                <div className="space-y-3">
                  <p className="text-xs uppercase text-muted-foreground">
                    {discount.discountFor === "category"
                      ? "Categories"
                      : discount.discountFor === "subCategory"
                      ? "Sub-Categories"
                      : discount.discountFor === "brand"
                      ? "Brands"
                      : "Products"}
                  </p>
                  {scopeItems.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      None selected.
                    </p>
                  )}
                  {scopeItems.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {scopeItems.map((name) => (
                        <Badge
                          key={name}
                          variant="secondary"
                          className="text-xs px-2 py-1 max-w-40 truncate">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDiscount;
