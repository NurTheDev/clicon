import React from 'react';
import {Outlet} from "react-router";
import Navbar from "../../common/Navbar.tsx";

const Index = () => {
    return (
        <div>
            <Navbar/>
            {Outlet && <Outlet />}
        </div>
    );
};

export default React.memo(Index);