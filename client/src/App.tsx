import {lazy, Suspense} from "react";
import {Route, Routes} from "react-router";
import PaymentSuccess from "./Pages/payment/PaymentSuccess.tsx";
import PaymentFailure from "./Pages/payment/PaymentFailure.tsx";
import PaymentCancel from "./Pages/payment/PaymentCancel.tsx";
import Loading from "./common/Loading.tsx";
import ProductDetails from "./Pages/mainLayout/Product/ProductDetails.tsx";

const App = () => {
    const Home = lazy(() => import("./Pages/mainLayout/Home/Home"));
    const Index = lazy(() => import("./Pages/mainLayout/Index"));
    const Shop = lazy(() => import("./Pages/mainLayout/shop/Shop.tsx"));
    return (
        <div>
            <Suspense fallback={<Loading/>}>
                <Routes>
                    <Route element={<Index/>}>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/shop"} element={<Shop/>}/>
                        <Route path={"/shop/:productId"} element={<ProductDetails/>}/>
                    </Route>
                    <Route path="/payment/success" element={<PaymentSuccess/>}/>
                    <Route path="/payment/fail" element={<PaymentFailure/>}/>
                    <Route path="/payment/cancel" element={<PaymentCancel/>}/>
                </Routes>
            </Suspense>
        </div>
    );
};
export default App;
