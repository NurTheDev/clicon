import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import PageLoading from "./loading/PageLoadingProps";
import CreateCoupon from "./page/coupon/CreateCoupon";
import EditCoupon from "./page/coupon/EditCoupon";
import ViewAllCoupons from "./page/coupon/ViewAllCoupons";
import ViewCoupon from "./page/coupon/ViewCoupon";
import AddProduct from "./page/product/AddProduct";
import EditProduct from "./page/product/EditProduct";
import GetAllProducts from "./page/product/GetAllProducts";
import ViewProduct from "./page/product/ViewProduct";
const Index = lazy(() => import("./page/Index"));
const Login = lazy(() => import("./page/authentication/Login"));
const Register = lazy(() => import("./page/authentication/Register"));
const AddBanner = lazy(() => import("./page/banner/AddBanner"));
const EditBanner = lazy(() => import("./page/banner/EditBanner"));
const GetAllBanner = lazy(() => import("./page/banner/GetAllBanner"));
const ViewBanner = lazy(() => import("./page/banner/ViewBanner"));
const AddBrand = lazy(() => import("./page/brand/AddBrand"));
const EditBrand = lazy(() => import("./page/brand/EditBrand"));
const GetAllBrands = lazy(() => import("./page/brand/GetAllBrands"));
const ViewBrand = lazy(() => import("./page/brand/ViewBrand"));
const AddCategory = lazy(() => import("./page/category/AddCategory"));
const EditCategory = lazy(() => import("./page/category/EditCategory"));
const GetAllCategories = lazy(() => import("./page/category/GetAllCategories"));
const ViewCategory = lazy(() => import("./page/category/ViewCategory"));
const AddSubCategory = lazy(() => import("./page/subcategory/AddSubCategory"));
const EditSubCategory = lazy(
  () => import("./page/subcategory/EditSubCategory")
);
const GetAllSubCategories = lazy(
  () => import("./page/subcategory/GetAllSubCategories")
);
const ViewSubCategory = lazy(
  () => import("./page/subcategory/ViewSubCategory")
);
const App = () => {
  const { email, phone } = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {email || phone ? (
          <>
            <Route
              path="login"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="register"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route path="/" element={<Navigate to={"/dashboard"} />} />
            <Route path="dashboard" element={<Index />}>
              <Route path="add-banner" element={<AddBanner />} />
              <Route path="banners" element={<GetAllBanner />} />
              <Route path="banners/:id" element={<ViewBanner />} />
              <Route path="banners/edit/:id" element={<EditBanner />} />
              <Route path="categories/add-category" element={<AddCategory />} />
              <Route path="categories" element={<GetAllCategories />} />
              <Route path="categories/:slug" element={<ViewCategory />} />
              <Route path="categories/edit/:slug" element={<EditCategory />} />
              <Route
                path="subcategories/add-subcategory"
                element={<AddSubCategory />}
              />
              <Route path="subcategories" element={<GetAllSubCategories />} />
              <Route path="subcategories/:slug" element={<ViewSubCategory />} />
              <Route
                path="subcategories/edit/:slug"
                element={<EditSubCategory />}
              />
              <Route path="brands/add-brand" element={<AddBrand />} />
              <Route path="brands" element={<GetAllBrands />} />
              <Route path="brands/:slug" element={<ViewBrand />} />
              <Route path="brands/edit/:slug" element={<EditBrand />} />
              <Route path="products/add-product" element={<AddProduct />} />
              <Route path="products" element={<GetAllProducts />} />
              <Route path="products/:slug" element={<ViewProduct />} />
              <Route path="products/edit/:slug" element={<EditProduct />} />
              <Route path="coupons/add-coupon" element={<CreateCoupon />} />
              <Route path="coupons" element={<ViewAllCoupons />} />
              <Route path="coupons/:slug" element={<ViewCoupon />} />
              <Route path="coupons/edit/:slug" element={<EditCoupon />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

export default App;
