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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import instance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  Copy,
  Edit,
  Eye,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
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
  applicableProducts: any[];
  applicableCategories: any[];
  applicableSubCategories: any[];
  applicableBrands: any[];
  createdAt: string;
  updatedAt: string;
};

const ViewAllCoupons = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch coupons
  const {
    data: coupons = [],
    isLoading,
    error,
  } = useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await instance.get("/coupon/get-all-coupons");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const response = await instance.delete(`/coupon/delete-coupon/${slug}`);
      return response.data;
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
    },
    onError: (error: any) => {
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

  // Filter coupons based on search
  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy coupon code to clipboard
  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
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
  };

  // Check if coupon is expired
  const isCouponExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Check if coupon is active now
  const isCouponActiveNow = (startDate: string, endDate: string) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  const confirmDelete = () => {
    const coupon = coupons.find((c) => c._id === deleteId);
    if (coupon) {
      deleteMutation.mutate(coupon.slug);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <p className="text-destructive text-center">
            Failed to load coupons. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">
            Manage your discount coupons and promotions
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/coupons/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Coupons
            </CardTitle>
            <Tag className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                coupons.filter(
                  (c) =>
                    c.isActive &&
                    isCouponActiveNow(c.startDate, c.endDate) &&
                    !isCouponExpired(c.endDate)
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.filter((c) => isCouponExpired(c.endDate)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons.reduce((acc, c) => acc + c.totalUsed, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons by code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Tag className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? "No coupons found matching your search"
                            : "No coupons created yet"}
                        </p>
                        {!searchTerm && (
                          <Button
                            onClick={() =>
                              navigate("/dashboard/coupons/create")
                            }
                            size="sm">
                            Create Your First Coupon
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => {
                    const isExpired = isCouponExpired(coupon.endDate);
                    const isActiveNow = isCouponActiveNow(
                      coupon.startDate,
                      coupon.endDate
                    );

                    return (
                      <TableRow key={coupon._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">
                              {coupon.code}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyCouponCode(coupon.code)}
                              className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          {coupon.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {coupon.description}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            {coupon.discountType === "percentage"
                              ? "Percentage"
                              : "Fixed"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="font-semibold">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : `$${coupon.discountValue.toFixed(2)}`}
                          </div>
                          {coupon.discountType === "percentage" &&
                            coupon.maxDiscountAmount && (
                              <p className="text-xs text-muted-foreground">
                                Max: ${coupon.maxDiscountAmount.toFixed(2)}
                              </p>
                            )}
                          {coupon.minPurchaseAmount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Min: ${coupon.minPurchaseAmount.toFixed(2)}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(
                                new Date(coupon.startDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(coupon.endDate), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            <div className="font-semibold">
                              {coupon.totalUsed}
                              {coupon.usageLimitTotal &&
                                ` / ${coupon.usageLimitTotal}`}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {coupon.usageLimitPerUser} per user
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={
                                coupon.isActive ? "default" : "secondary"
                              }>
                              {coupon.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {isExpired && (
                              <Badge variant="destructive">Expired</Badge>
                            )}
                            {!isExpired &&
                              !isActiveNow &&
                              new Date(coupon.startDate) > new Date() && (
                                <Badge variant="outline">Scheduled</Badge>
                              )}
                            {isActiveNow && coupon.isActive && !isExpired && (
                              <Badge className="bg-green-500">Live</Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/dashboard/coupons/${coupon.slug}`)
                              }>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/dashboard/coupons/edit/${coupon.slug}`
                                )
                              }>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(coupon._id)}
                              disabled={deleteMutation.isPending}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white border rounded-lg shadow-lg p-6 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              coupon "{coupons.find((c) => c._id === deleteId)?.code}" and
              remove all its usage data.
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

export default ViewAllCoupons;
