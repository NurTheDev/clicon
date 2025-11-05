import { Route, Routes } from "react-router";
import Index from "./page/Index";
import AddBanner from "./page/components/AddBanner";
import GetAllBanner from "./page/components/GetAllBanner";
import ViewBanner from "./page/components/ViewBanner";
const App = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Index />}>
        <Route path="add-banner" element={<AddBanner />} />
        <Route path="banners" element={<GetAllBanner />} />
        <Route path="banners/:id" element={<ViewBanner />} />
      </Route>
    </Routes>
  );
};

export default App;
