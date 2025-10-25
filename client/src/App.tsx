import {lazy, Suspense} from "react";
import {Route, Routes} from "react-router";
import PaymentSuccess from "./Pages/payment/PaymentSuccess.tsx";
import PaymentFailure from "./Pages/payment/PaymentFailure.tsx";
import PaymentCancel from "./Pages/payment/PaymentCancel.tsx";

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
                    <Route path="/payment/success" element={<PaymentSuccess/>}/>
                    <Route path="/payment/fail" element={<PaymentFailure/>}/>
                    <Route path="/payment/cancel" element={<PaymentCancel/>}/>
                </Routes>
            </Suspense>
        </div>
    );
};
export default App;
