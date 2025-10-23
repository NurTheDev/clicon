export type ProductType = {
    id: number;
    title: string;
    price: string;
    images: string[];
    rating?: number;
    reviews: string[];
    discountPercentage?: number;
    name?: string;
};