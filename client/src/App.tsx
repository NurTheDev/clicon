import {lazy, Suspense} from "react";
import {Route, Routes} from "react-router";

const App = () => {
    const Home = lazy(() => import("./Pages/mainLayout/Home/Home"));
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Suspense>
        </div>
    );
};

export default App;
