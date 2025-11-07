import { Route, Routes } from "react-router";
import Index from "./page/Index";
import AddBanner from "./page/banner/AddBanner";
import EditBanner from "./page/banner/EditBanner";
import GetAllBanner from "./page/banner/GetAllBanner";
import ViewBanner from "./page/banner/ViewBanner";
import AddBrand from "./page/brand/AddBrand";
import EditBrand from "./page/brand/EditBrand";
import GetAllBrands from "./page/brand/GetAllBrands";
import ViewBrand from "./page/brand/ViewBrand";
import AddCategory from "./page/category/AddCategory";
import EditCategory from "./page/category/EditCategory";
import GetAllCategories from "./page/category/GetAllCategories";
import ViewCategory from "./page/category/ViewCategory";
import AddSubCategory from "./page/subcategory/AddSubCategory";
import EditSubCategory from "./page/subcategory/EdtitSubCategory";
import GetAllSubCategories from "./page/subcategory/GetAllSubCategories";
import ViewSubCategory from "./page/subcategory/ViewSubCategory";
const App = () => {
  return (
    <Routes>
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
        <Route path="subcategories/edit/:slug" element={<EditSubCategory />} />
        <Route path="brands/add-brand" element={<AddBrand />} />
        <Route path="brands" element={<GetAllBrands />} />
        <Route path="brands/:slug" element={<ViewBrand />} />
        <Route path="brands/edit/:slug" element={<EditBrand />} />
      </Route>
    </Routes>
  );
};

export default App;
