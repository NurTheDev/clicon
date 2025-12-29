import * as z from "zod";

export const productFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    wholeSalePrice: z.number().min(0).optional(),
    retailPrice: z.number().min(0).optional(),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().optional(),
    brand: z.string().optional(),
    tags: z.string().optional(),
    sku: z.string().optional(),
    warranty: z.string().optional(),
    shipping: z.string().optional(),
    returnPolicy: z.string().optional(),
    minimumOrderQuantity: z.number().int().min(1),
    variantType: z.enum(["single", "multiple"]),
    size: z.enum(["xs", "s", "m", "l", "xl", "xxl"]).optional(),
    color: z.enum(["red", "blue", "green", "yellow", "black", "white", "gray", "brown", "purple", "orange", "custom"]).optional(),
    customColor: z.string().optional(),
    groupUnit: z.enum(["box", "pack", "set", "pair", "unit", "other"]),
    groupQuantity: z.number().int().min(1),
    unit: z.enum(["piece", "kg", "gram", "litre", "ml", "other"]),
    alertQuantity: z.number().int().min(0),
    isActive: z.boolean(),
    isAvailable: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
