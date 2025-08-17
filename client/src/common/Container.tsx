import React from "react";
type Props = {
    children: React.ReactNode
}
const Container : React.FC<Props> = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="container mx-auto">
            {children}
        </div>
    );
};

export default Container;