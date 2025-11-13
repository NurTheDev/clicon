import React from "react";
import { Outlet, Route, Routes } from "react-router";
import Footer from "../../common/Footer.tsx";
import Navbar from "../../common/navbar/Navbar.tsx";
import PaymentCancel from "../payment/PaymentCancel.tsx";

const Index = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/payment/cancel" element={<PaymentCancel />} />
      </Routes>
      {Outlet && <Outlet />}
      <Footer />
    </div>
  );
};

export default React.memo(Index);
