import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import instance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";

type Discount = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
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

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

const scopeCount = (d: Discount) => {
  switch (d.discountFor) {
    case "category":
      return d.category?.length || 0;
    case "subCategory":
      return d.subCategory?.length || 0;
    case "brand":
      return d.brand?.length || 0;
    case "product":
      return d.product?.length || 0;
    default:
      return 0;
  }
};

const lifecycle = (d: Discount): "live" | "scheduled" | "expired" => {
  const now = new Date();
  const start = new Date(d.startAt);
  const end = new Date(d.endAt);
  if (end.getTime() && end < now) return "expired";
  if (start.getTime() && start > now) return "scheduled";
  return "live";
};

const DiscountList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [type, setType] = useState<"all" | "percentage" | "fixed">("all");
  const [scope, setScope] = useState<
    "all" | "allProducts" | "category" | "subCategory" | "brand" | "product"
  >("all");

  const {
    data: discounts = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Discount[]>({
    queryKey: ["discounts"],
    queryFn: async () => {
      const res = await instance.get("/discount/get-all-discount");
      // Try common shapes: {data: [...]}, {data: {data: [...]}}
      const maybe = res.data?.data ?? res.data?.discounts ?? res.data;
      return Array.isArray(maybe)
        ? maybe
        : maybe?.discounts ?? maybe?.items ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await instance.delete(`/discount/delete-discount/${slug}`);
      const result = res.data;
      if (result?.status !== "success") {
        throw new Error(result?.message || "Failed to delete discount");
      }
      return slug;
    },
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: ["discounts"] });
      const previous = queryClient.getQueryData<Discount[]>(["discounts"]);
      if (previous) {
        queryClient.setQueryData<Discount[]>(
          ["discounts"],
          previous.filter((d) => d.slug !== slug)
        );
      }
      return { previous };
    },
    onError: (error: any, _slug, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["discounts"], ctx.previous);
      }
      toast.error(error?.message || "Delete failed", {
        position: "top-right",
        transition: Bounce,
      });
    },
    onSuccess: () => {
      toast.success("Discount deleted", {
        position: "top-right",
        transition: Bounce,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });

  const filtered = useMemo(() => {
    return discounts
      .filter((d) => {
        if (search.trim().length) {
          const q = search.toLowerCase();
          if (
            !d.name.toLowerCase().includes(q) &&
            !d.slug?.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        if (status !== "all") {
          if (status === "active" && !d.isActive) return false;
          if (status === "inactive" && d.isActive) return false;
        }
        if (type !== "all" && d.discountType !== type) return false;
        if (scope !== "all") {
          if (scope === "allProducts" && d.discountFor !== "all") return false;
          if (
            ["category", "subCategory", "brand", "product"].includes(scope) &&
            d.discountFor !== scope
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Recent first by startAt, fallback createdAt
        const aT = new Date(a.startAt || a.createdAt || 0).getTime();
        const bT = new Date(b.startAt || b.createdAt || 0).getTime();
        return bT - aT;
      });
  }, [discounts, search, status, type, scope]);

  const onDelete = (slug: string) => {
    if (!slug) return;
    if (window.confirm("Delete this discount? This cannot be undone.")) {
      deleteMutation.mutate(slug);
    }
  };

  const renderStatusBadge = (d: Discount) => {
    const life = lifecycle(d);
    const common = "text-xs";
    if (!d.isActive) {
      return (
        <Badge variant="outline" className={common}>
          Inactive
        </Badge>
      );
    }
    if (life === "scheduled") {
      return (
        <Badge variant="outline" className={common}>
          Scheduled
        </Badge>
      );
    }
    if (life === "expired") {
      return (
        <Badge variant="outline" className={common}>
          Expired
        </Badge>
      );
    }
    return <Badge className={common}>Live</Badge>;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2">
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => navigate("/dashboard/discounts/add-discount")}>
            <Plus className="h-4 w-4" />
            Create Discount
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <Input
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />

        <div className="flex gap-3">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={scope}
            onValueChange={(v) => setScope(v as typeof scope)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scopes</SelectItem>
              <SelectItem value="allProducts">All Products</SelectItem>
              <SelectItem value="category">Categories</SelectItem>
              <SelectItem value="subCategory">Sub-Categories</SelectItem>
              <SelectItem value="brand">Brands</SelectItem>
              <SelectItem value="product">Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-muted-foreground">
                  Loading discounts...
                </td>
              </tr>
            )}

            {isError && !isLoading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-destructive">
                  Failed to load discounts.
                </td>
              </tr>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-muted-foreground">
                  No discounts found.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              filtered.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-xs text-muted-foreground">
                        /{d.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {d.discountFor}
                      </Badge>
                      {d.discountFor !== "all" && scopeCount(d) > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {scopeCount(d)} selected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <Badge variant="outline" className="text-xs capitalize">
                      {d.discountType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {d.discountType === "percentage"
                      ? `${d.discountValue}%`
                      : `$${Number(d.discountValue).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3">{renderStatusBadge(d)}</td>
                  <td className="px-4 py-3">{formatDateTime(d.startAt)}</td>
                  <td className="px-4 py-3">{formatDateTime(d.endAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View"
                        onClick={() =>
                          navigate(`/dashboard/discounts/${d.slug}`)
                        }>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={() =>
                          navigate(`/dashboard/discounts/edit/${d.slug}`)
                        }>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => onDelete(d.slug)}
                        disabled={deleteMutation.isPending}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountList;
