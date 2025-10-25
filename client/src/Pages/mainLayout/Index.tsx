import React from 'react';
import {Outlet, Route, Routes} from "react-router";
import Navbar from "../../common/Navbar.tsx";
import PaymentCancel from "../payment/PaymentCancel.tsx";

const Index = () => {
    return (
        <div>
            <Navbar/>
            <Routes>
                <Route path="/payment/cancel" element={<PaymentCancel />} />
            </Routes>
            {Outlet && <Outlet />}
        </div>
    );
};

export default React.memo(Index);