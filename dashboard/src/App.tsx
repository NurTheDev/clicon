import { Route, Routes } from "react-router";
import Index from "./page/Index";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />}>
        {/* <Route index element={<Home />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
