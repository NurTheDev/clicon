import React from 'react';

type buttonTypes = {
    children: React.ReactNode,
    className: string
}
const PrimaryButton: React.FC<buttonTypes> = ({children, className}) => {
    return (
        <button className={className }>
            {children}
        </button>
    );
};

export default React.memo(PrimaryButton) || PrimaryButton;