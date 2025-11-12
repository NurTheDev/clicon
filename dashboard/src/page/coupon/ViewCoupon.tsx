import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import instance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Copy,
  DollarSign,
  Edit,
  Package,
  Percent,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Bounce, toast } from "react-toastify";

type Coupon = {
  _id: string;
  code: string;
  slug: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount: number;
  startDate: string;
  endDate: string;
  usageLimitPerUser: number;
  usageLimitTotal?: number;
  totalUsed: number;
  isActive: boolean;
  applicableProducts: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  applicableCategories: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  applicableSubCategories: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  applicableBrands: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

const ViewCoupon = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch coupon
  const {
    data: coupon,
    isLoading,
    error,
  } = useQuery<Coupon>({
    queryKey: ["coupon", slug],
    queryFn: async () => {
      const response = await instance.get(`/coupon/get-coupon/${slug}`);
      const result = response.data;

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to fetch coupon details");
      }

      return result.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (couponSlug: string) => {
      const response = await instance.delete(
        `/coupon/delete-coupon/${couponSlug}`
      );
      const result = response.data;

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to delete coupon");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setDeleteId(null);

      toast.success("Coupon deleted successfully!", {
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
      console.error("Delete failed:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete coupon";

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

      setDeleteId(null);
    },
  });

  const confirmDelete = () => {
    if (deleteId && coupon) {
      deleteMutation.mutate(coupon.slug);
    }
  };

  // Copy coupon code to clipboard
  const copyCouponCode = () => {
    if (coupon) {
      navigator.clipboard.writeText(coupon.code);
      toast.success("Coupon code copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  // Check if coupon is expired
  const isCouponExpired = () => {
    if (!coupon) return false;
    return new Date(coupon.endDate) < new Date();
  };

  // Check if coupon is active now
  const isCouponActiveNow = () => {
    if (!coupon) return false;
    const now = new Date();
    return new Date(coupon.startDate) <= now && new Date(coupon.endDate) >= now;
  };

  // Check if coupon is scheduled
  const isCouponScheduled = () => {
    if (!coupon) return false;
    return new Date(coupon.startDate) > new Date();
  };

  const handleDelete = () => {
    if (coupon) {
      setDeleteId(coupon._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <p className="text-destructive text-center">
            Failed to load coupon details. Please try again.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/dashboard/coupons")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Coupons
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/coupons/edit/${coupon.slug}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Coupon
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Coupon Code & Status */}
        <div className="lg:col-span-1 space-y-4">
          {/* Coupon Code Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <Tag className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Coupon Code
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-3xl font-bold font-mono tracking-wider">
                      {coupon.code}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyCouponCode}
                      className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Discount Badge */}
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {coupon.discountType === "percentage" ? (
                      <Percent className="h-5 w-5 text-primary" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-primary" />
                    )}
                    <span className="text-sm font-medium text-primary">
                      {coupon.discountType === "percentage"
                        ? "Percentage Discount"
                        : "Fixed Discount"}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-primary">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `$${coupon.discountValue.toFixed(2)}`}
                  </p>
                  {coupon.discountType === "percentage" &&
                    coupon.maxDiscountAmount && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Max discount: ${coupon.maxDiscountAmount.toFixed(2)}
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={coupon.isActive ? "default" : "secondary"}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Availability
                </span>
                <div className="flex flex-col gap-1 items-end">
                  {isCouponExpired() && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                  {isCouponScheduled() && (
                    <Badge variant="outline">Scheduled</Badge>
                  )}
                  {isCouponActiveNow() && coupon.isActive && (
                    <Badge className="bg-green-500">Live</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Used
                </span>
                <span className="font-semibold">{coupon.totalUsed}</span>
              </div>
              <Separator />
              {coupon.usageLimitTotal && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Usage Limit
                    </span>
                    <span className="font-semibold">
                      {coupon.usageLimitTotal}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Remaining
                    </span>
                    <span className="font-semibold text-green-600">
                      {coupon.usageLimitTotal - coupon.totalUsed}
                    </span>
                  </div>
                  <Separator />
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Per User Limit
                </span>
                <span className="font-semibold">
                  {coupon.usageLimitPerUser}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              {coupon.description && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{coupon.description}</p>
                </div>
              )}
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Coupon Code</TableCell>
                    <TableCell className="text-right font-mono">
                      {coupon.code}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Slug</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {coupon.slug}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Discount Type</TableCell>
                    <TableCell className="text-right capitalize">
                      {coupon.discountType}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Discount Value
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue.toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                  {coupon.discountType === "percentage" &&
                    coupon.maxDiscountAmount && (
                      <TableRow>
                        <TableCell className="font-medium">
                          Max Discount Amount
                        </TableCell>
                        <TableCell className="text-right">
                          ${coupon.maxDiscountAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                  {coupon.minPurchaseAmount > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Minimum Purchase Amount
                      </TableCell>
                      <TableCell className="text-right">
                        ${coupon.minPurchaseAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Start Date</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(coupon.startDate), "PPpp")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End Date</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(coupon.endDate), "PPpp")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duration</TableCell>
                    <TableCell className="text-right">
                      {Math.ceil(
                        (new Date(coupon.endDate).getTime() -
                          new Date(coupon.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Applicable Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Applicable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Products */}
              {coupon.applicableProducts.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Products ({coupon.applicableProducts.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coupon.applicableProducts.map((product) => (
                      <Badge key={product._id} variant="secondary">
                        {product.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {coupon.applicableCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Categories ({coupon.applicableCategories.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coupon.applicableCategories.map((category) => (
                      <Badge key={category._id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Categories */}
              {coupon.applicableSubCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Sub-Categories ({coupon.applicableSubCategories.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coupon.applicableSubCategories.map((subCategory) => (
                      <Badge key={subCategory._id} variant="secondary">
                        {subCategory.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {coupon.applicableBrands.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Brands ({coupon.applicableBrands.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coupon.applicableBrands.map((brand) => (
                      <Badge key={brand._id} variant="secondary">
                        {brand.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* No applicable items */}
              {coupon.applicableProducts.length === 0 &&
                coupon.applicableCategories.length === 0 &&
                coupon.applicableSubCategories.length === 0 &&
                coupon.applicableBrands.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    This coupon is applicable to all products
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Coupon ID</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {coupon._id}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created At</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(coupon.createdAt), "PPpp")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Last Updated</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(coupon.updatedAt), "PPpp")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white border rounded-lg shadow-lg p-6 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              coupon "{coupon?.code}" and remove all its usage data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel
              className="px-4 py-2"
              disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2">
              {deleteMutation.isPending ? "Deleting..." : "Delete Coupon"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewCoupon;
