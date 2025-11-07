import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Package,
  Pencil,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  discount?: {
    _id: string;
    name: string;
    percentage: number;
  };
  products: Array<{
    _id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

const ViewSubCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch single subcategory
  const {
    data: subCategory,
    isLoading,
    error,
  } = useQuery<SubCategory>({
    queryKey: ["subcategory", slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/subCategory/get-subCategory/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subcategory");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
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

  if (error || !subCategory) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">
                Failed to load subcategory details.
              </p>
              <Button onClick={() => navigate("/dashboard/subcategories")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subcategories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/subcategories")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Subcategories
        </Button>
        <Button
          onClick={() =>
            navigate(`/dashboard/subcategories/edit/${subCategory.slug}`)
          }
          className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Subcategory
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subcategory Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subcategory Information</CardTitle>
                <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                  {subCategory.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>
                Detailed information about this subcategory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-lg font-semibold mt-1">{subCategory.name}</p>
              </div>

              <Separator />

              {/* Slug */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Slug
                </label>
                <p className="text-base mt-1 font-mono text-foreground/80">
                  {subCategory.slug}
                </p>
              </div>

              <Separator />

              {/* Parent Category */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Parent Category
                </label>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="text-base cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/dashboard/categories/${subCategory.category.slug}`
                      )
                    }>
                    {subCategory.category.name}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Discount */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Discount
                </label>
                <div className="mt-2">
                  {subCategory.discount ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {subCategory.discount.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({subCategory.discount.percentage}% off)
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No discount applied
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products ({subCategory.products.length})
              </CardTitle>
              <CardDescription>Products in this subcategory</CardDescription>
            </CardHeader>
            <CardContent>
              {subCategory.products.length > 0 ? (
                <div className="space-y-2">
                  {subCategory.products.map((product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(`/dashboard/products/${product._id}`)
                      }>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No products in this subcategory yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Status
                </span>
                <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                  {subCategory.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Products
                </span>
                <Badge variant="outline">{subCategory.products.length}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Has Discount
                </span>
                <Badge variant={subCategory.discount ? "default" : "secondary"}>
                  {subCategory.discount ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Parent Category Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Parent Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm mt-1">{subCategory.category.name}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Slug
                  </label>
                  <p className="text-xs mt-1 font-mono text-foreground/80">
                    {subCategory.category.slug}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() =>
                    navigate(
                      `/dashboard/categories/${subCategory.category.slug}`
                    )
                  }>
                  View Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(subCategory.createdAt), "PPP 'at' p")}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(subCategory.updatedAt), "PPP 'at' p")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewSubCategory;
