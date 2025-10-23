export type ProductType = {
    id: number;
    title: string;
    price: number;
    images: string[];
    rating?: number;
    reviews: string[];
    discountPercentage?: number;
    name?: string;
};