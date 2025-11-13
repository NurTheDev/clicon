import StatusBar from "./component/StatusBar.tsx";
import TopNav from "./component/TopNav.tsx";
import MiddleNav from "./component/MiddleNav.tsx";
import BottomNav from "./component/BottomNav.tsx";
import React from "react";
const Navbar = () => {
  return (
    <div>
      <StatusBar />
      <TopNav />
      <MiddleNav />
      <BottomNav />
    </div>
  );
};

export default React.memo(Navbar);  
