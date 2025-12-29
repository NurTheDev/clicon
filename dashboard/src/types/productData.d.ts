export type Category = {
    _id: string;
    name: string;
};
export type SubCategory = {
    _id: string;
    name: string;
    category: string;
};
export type Brand = {
    _id: string;
    name: string;
};