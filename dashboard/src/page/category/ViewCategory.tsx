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

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: {
    public_id: string;
    url: string;
  };
  isActive: boolean;
  subCategories: Array<{
    _id: string;
    name: string;
  }>;
  products: Array<{
    _id: string;
    name: string;
  }>;
  discount: string[];
  createdAt: string;
  updatedAt: string;
};

const ViewCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  console.log(
    `${import.meta.env.VITE_BASE_URL}${
      import.meta.env.VITE_API_VERSION
    }/category/get-category/${slug}`
  );
  // Fetch single category
  const {
    data: category,
    isLoading,
    error,
  } = useQuery<Category>({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/category/get-category/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }

      const result = await response.json();
      return result.data;
    },
    enabled: !!slug,
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

  if (error || !category) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Category not found or error loading category.
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/dashboard/categories")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/categories")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">Category Details</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/dashboard/categories/edit/${slug}`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General details about this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Category Name
                  </label>
                  <p className="text-lg font-semibold mt-1">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Slug
                  </label>
                  <p className="text-lg font-mono mt-1">{category.slug}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                      className="text-sm">
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {format(new Date(category.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {format(new Date(category.updatedAt), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subcategories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Subcategories ({category.subCategories?.length || 0})
              </CardTitle>
              <CardDescription>
                All subcategories under this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.subCategories && category.subCategories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {category.subCategories.map((subCat) => (
                    <Card
                      key={subCat._id}
                      className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <p className="font-medium">{subCat.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {subCat._id.slice(-6)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No subcategories yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products ({category.products?.length || 0})
              </CardTitle>
              <CardDescription>All products in this category</CardDescription>
            </CardHeader>
            <CardContent>
              {category.products && category.products.length > 0 ? (
                <div className="space-y-2">
                  {category.products.map((product) => (
                    <Card
                      key={product._id}
                      className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {product._id}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/dashboard/products/${product._id}`)
                          }>
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No products in this category yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Category Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Public ID:</span>
                  <span className="font-mono text-xs">
                    {category.image.public_id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subcategories
                </span>
                <Badge variant="outline">
                  {category.subCategories?.length || 0}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Products</span>
                <Badge variant="outline">
                  {category.products?.length || 0}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discounts</span>
                <Badge variant="outline">
                  {category.discount?.length || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/dashboard/categories/edit/${slug}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Category
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate("/dashboard/subcategories/create")}>
                <Tag className="mr-2 h-4 w-4" />
                Add Subcategory
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate("/dashboard/products/create")}>
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
