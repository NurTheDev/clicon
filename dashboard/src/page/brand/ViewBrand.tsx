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
  Image as ImageIcon,
  Package,
  Pencil,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  image: {
    public_id: string;
    url: string;
  };
  isActive: boolean;
  products: Array<{
    _id: string;
    name: string;
  }>;
  discount?: {
    _id: string;
    name: string;
    percentage: number;
  };
  createdAt: string;
  updatedAt: string;
};

const ViewBrand = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch single brand
  const {
    data: brand,
    isLoading,
    error,
  } = useQuery<Brand>({
    queryKey: ["brand", slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/brand/single-brand/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch brand");
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

  if (error || !brand) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">
                Failed to load brand details.
              </p>
              <Button onClick={() => navigate("/dashboard/brands")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Brands
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
          onClick={() => navigate("/dashboard/brands")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Button>
        <Button
          onClick={() => navigate(`/dashboard/brands/edit/${brand.slug}`)}
          className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Brand
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Brand Information</CardTitle>
                <Badge variant={brand.isActive ? "default" : "secondary"}>
                  {brand.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>
                Detailed information about this brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Brand Name
                </label>
                <p className="text-lg font-semibold mt-1">{brand.name}</p>
              </div>

              <Separator />

              {/* Slug */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Slug
                </label>
                <p className="text-base mt-1 font-mono text-foreground/80">
                  {brand.slug}
                </p>
              </div>

              <Separator />

              {/* Discount */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Discount
                </label>
                <div className="mt-2">
                  {brand.discount ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{brand.discount.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ({brand.discount.percentage}% off)
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
                Products ({brand.products.length})
              </CardTitle>
              <CardDescription>Products under this brand</CardDescription>
            </CardHeader>
            <CardContent>
              {brand.products.length > 0 ? (
                <div className="space-y-2">
                  {brand.products.map((product, index) => (
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
                    No products under this brand yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Brand Logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full border rounded-lg bg-white p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={brand.image.url}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <p className="font-mono break-all">
                  ID: {brand.image.public_id}
                </p>
              </div>
            </CardContent>
          </Card>

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
                <Badge variant={brand.isActive ? "default" : "secondary"}>
                  {brand.isActive ? "Active" : "Inactive"}
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
                <Badge variant="outline">{brand.products.length}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Has Discount
                </span>
                <Badge variant={brand.discount ? "default" : "secondary"}>
                  {brand.discount ? "Yes" : "No"}
                </Badge>
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
                  {format(new Date(brand.createdAt), "PPP 'at' p")}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(brand.updatedAt), "PPP 'at' p")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewBrand;
