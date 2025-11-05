import { Route, Routes } from "react-router";
import Index from "./page/Index";
import AddBanner from "./page/banner/AddBanner";
import EditBanner from "./page/banner/EditBanner";
import GetAllBanner from "./page/banner/GetAllBanner";
import ViewBanner from "./page/banner/ViewBanner";
import AddCategory from "./page/category/AddCategory";
import GetAllCategories from "./page/category/GetAllCategories";
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
      </Route>
    </Routes>
  );
};

export default App;
