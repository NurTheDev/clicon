import React from "react";
type Props = {
    children: React.ReactNode
}
const Container : React.FC<Props> = ({children}: Props) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    );
};

export default React.memo(Container);

