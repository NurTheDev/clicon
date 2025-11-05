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
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  Pencil,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

type Banner = {
  _id: string;
  title: string;
  description?: string;
  image: {
    public_id: string;
    url: string;
  };
  link?: string;
  slug?: string;
  priority: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

const ViewBanner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch single banner
  const {
    data: banner,
    isLoading,
    error,
  } = useQuery<Banner>({
    queryKey: ["banner", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API_VERSION
        }/banner/get_banner/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch banner");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const getBannerStatus = (banner: Banner) => {
    if (!banner.isActive)
      return { label: "Inactive", variant: "secondary" as const };

    const now = new Date();
    const start = banner.startDate ? new Date(banner.startDate) : null;
    const end = banner.endDate ? new Date(banner.endDate) : null;

    if (start && now < start)
      return { label: "Scheduled", variant: "default" as const };
    if (end && now > end)
      return { label: "Expired", variant: "destructive" as const };

    return { label: "Active", variant: "default" as const };
  };

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

  if (error || !banner) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">
                Failed to load banner details.
              </p>
              <Button onClick={() => navigate("/dashboard/banners")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Banners
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getBannerStatus(banner);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/banners")}
          className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Banners
        </Button>
        <Button
          onClick={() => navigate(`/dashboard/banners/edit/${banner._id}`)}
          className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner Image */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Banner Preview</CardTitle>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={banner.image.url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Banner Details */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Information</CardTitle>
              <CardDescription>
                Detailed information about this banner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Title
                </label>
                <p className="text-lg font-semibold mt-1">{banner.title}</p>
              </div>

              <Separator />

              {/* Description */}
              {banner.description && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <p className="text-base mt-1 text-foreground/90">
                      {banner.description}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Link */}
              {banner.link && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Link URL
                    </label>
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base mt-1 text-primary hover:underline flex items-center gap-1">
                      {banner.link}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Separator />
                </>
              )}

              {/* Slug */}
              {banner.slug && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Slug
                    </label>
                    <p className="text-base mt-1 font-mono text-foreground/80">
                      {banner.slug}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Priority
                </label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-base">
                    {banner.priority}
                  </Badge>
                </div>
              </div>
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
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Status
                </span>
                <Badge variant={banner.isActive ? "default" : "secondary"}>
                  {banner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current State
                </span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {banner.startDate ? (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>
                  <p className="text-sm mt-1">
                    {format(new Date(banner.startDate), "PPP 'at' p")}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Not scheduled
                  </p>
                </div>
              )}

              {banner.endDate && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      End Date
                    </label>
                    <p className="text-sm mt-1">
                      {format(new Date(banner.endDate), "PPP 'at' p")}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Image Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Public ID
                </label>
                <p className="text-xs mt-1 font-mono text-foreground/80 break-all">
                  {banner.image.public_id}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  URL
                </label>
                <a
                  href={banner.image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-1 text-primary hover:underline break-all flex items-center gap-1">
                  View Image
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(banner.createdAt), "PPP 'at' p")}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(banner.updatedAt), "PPP 'at' p")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewBanner;
