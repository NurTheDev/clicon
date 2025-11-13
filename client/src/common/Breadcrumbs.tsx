import React from 'react';
import {Link, useLocation} from "react-router-dom";
import Container from "./Container.tsx";

const Breadcrumbs = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x);
    if(pathnames.length === 0) return null;
    return (
        <div className={"bg-gray-50 py-4"}>
            <Container>
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li>
                            <Link to={"/"} className="!flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 stroke-current">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                </svg>
                                <span>Home</span>
                            </Link>
                        </li>
                        {pathnames.map((path, index) => (
                            <li key={index}>
                                {index === path.length -1 ? (<span>{path}</span>) : (
                                    <Link to={`/${pathnames.slice(0, index + 1).join('/')}`}>
                                        {path}
                                    </Link>
                                )
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(Breadcrumbs);