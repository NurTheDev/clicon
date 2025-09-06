import React from 'react';
type SearchBarProps={
    children: React.ReactNode,
    className: string
}
const SearchBar:React.FC<SearchBarProps> = ({children, className}) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export default React.memo(SearchBar) || SearchBar;