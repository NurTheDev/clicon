import {lazy, Suspense} from "react";
import {Route, Routes} from "react-router";

const App = () => {
    const Home = lazy(() => import("./Pages/mainLayout/Home/Home"));
    const Index = lazy(() => import("./Pages/mainLayout/Index"));
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route element={<Index/>}>
                        <Route path={"/"} element={<Home/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </div>
    );
};

export default App;
