import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import instance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Image as ImageIcon,
  Package,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: {
    url: string;
    public_id: string;
  };
  images: Array<{
    url: string;
    public_id: string;
  }>;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  isAvailable: boolean;
  tags: string[];
  sku?: string;
  variantType: "single" | "multiple";
  size?: string;
  color?: string;
  customColor?: string;
  wholeSalePrice?: number;
  retailPrice?: number;
  wholeSaleProfit?: number;
  retailProfit?: number;
  discountPrice?: number;
  warranty?: string;
  shipping?: string;
  returnPolicy?: string;
  minimumOrderQuantity: number;
  groupUnit: string;
  groupQuantity: number;
  unit: string;
  alertQuantity: number;
  totalSales: number;
  isBestSelling: boolean;
  createdAt: string;
  updatedAt: string;
};

const ViewProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Fetch product
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await instance.get(`/product/product/${slug}`);
      const result = response.data;

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to fetch product details");
      }

      return result.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  // Set initial selected image
  if (product && !selectedImage) {
    setSelectedImage(product.thumbnail.url);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <p className="text-destructive text-center">
            Failed to load product details. Please try again.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/dashboard/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
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
          onClick={() => navigate("/dashboard/products")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/dashboard/products/edit/${product.slug}`)
            }>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="pt-6">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedImage(product.thumbnail.url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === product.thumbnail.url
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300"
                  }`}>
                  <img
                    src={product.thumbnail.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>

                {product.images.map((image, index) => (
                  <button
                    key={image.public_id}
                    onClick={() => setSelectedImage(image.url)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === image.url
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300"
                    }`}>
                    <img
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Image Count */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>{product.images.length + 1} images</span>
              </div>
            </CardContent>
          </Card>

          {/* Status Cards */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Availability
                </span>
                <Badge
                  variant={product.isAvailable ? "default" : "destructive"}>
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{product.variantType}</Badge>
              </div>
              {product.isBestSelling && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Best Seller
                    </span>
                    <Badge className="bg-yellow-500">⭐ Best Seller</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{product.name}</CardTitle>
                  {product.sku && (
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.discountPrice && (
                    <p className="text-sm line-through text-muted-foreground">
                      ${product.discountPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline">{product.category.name}</Badge>
                </div>
                {product.subCategory && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Sub Category
                    </p>
                    <Badge variant="outline">{product.subCategory.name}</Badge>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Brand</p>
                    <Badge variant="outline">{product.brand.name}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Pricing & Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Regular Price</TableCell>
                    <TableCell className="text-right">
                      ${product.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {product.wholeSalePrice && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Wholesale Price
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.wholeSalePrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.retailPrice && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Retail Price
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.retailPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.wholeSaleProfit && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Wholesale Profit
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        ${product.wholeSaleProfit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.retailProfit && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Retail Profit
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        ${product.retailProfit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">
                      Stock Quantity
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          product.stock < 10 ? "destructive" : "default"
                        }>
                        {product.stock} {product.unit}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Alert Quantity
                    </TableCell>
                    <TableCell className="text-right">
                      {product.alertQuantity}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Sales</TableCell>
                    <TableCell className="text-right font-semibold">
                      {product.totalSales}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {product.size && (
                    <TableRow>
                      <TableCell className="font-medium">Size</TableCell>
                      <TableCell className="text-right uppercase">
                        {product.size}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.color && (
                    <TableRow>
                      <TableCell className="font-medium">Color</TableCell>
                      <TableCell className="text-right capitalize">
                        {product.color === "custom"
                          ? product.customColor
                          : product.color}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Unit</TableCell>
                    <TableCell className="text-right capitalize">
                      {product.unit}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Group Unit</TableCell>
                    <TableCell className="text-right capitalize">
                      {product.groupUnit}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Group Quantity
                    </TableCell>
                    <TableCell className="text-right">
                      {product.groupQuantity}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Minimum Order Quantity
                    </TableCell>
                    <TableCell className="text-right">
                      {product.minimumOrderQuantity}
                    </TableCell>
                  </TableRow>
                  {product.warranty && (
                    <TableRow>
                      <TableCell className="font-medium">Warranty</TableCell>
                      <TableCell className="text-right">
                        {product.warranty}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.shipping && (
                    <TableRow>
                      <TableCell className="font-medium">Shipping</TableCell>
                      <TableCell className="text-right">
                        {product.shipping}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.returnPolicy && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Return Policy
                      </TableCell>
                      <TableCell className="text-right">
                        {product.returnPolicy}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                    <TableCell className="font-medium">Product ID</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {product._id}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Slug</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {product.slug}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created At</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(product.createdAt), "PPpp")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Last Updated</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(product.updatedAt), "PPpp")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
