import { Route, Routes } from "react-router";
import Index from "./page/Index";
import AddBanner from "./page/components/AddBanner";
import GetAllBanner from "./page/components/GetAllBanner";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />}>
        <Route path="add-banner" element={<AddBanner />} />
        <Route path="banners" element={<GetAllBanner />} />
      </Route>
    </Routes>
  );
};

export default App;
