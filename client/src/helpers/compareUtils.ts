export const addToCompare = (product: any) => {
    const stored = localStorage.getItem('compareProducts');
    const products = stored ? JSON.parse(stored) : [];

    if (products.length >= 4) {
        return { success: false, message: 'Maximum 4 products can be compared' };
    }

    if (products.find((p: any) => p.id === product.id)) {
        return { success: false, message: 'Product already in compare list' };
    }

    products.push(product);
    localStorage.setItem('compareProducts', JSON.stringify(products));
    return { success: true, message: 'Product added to compare' };
};

/* <<<<<<<<<<<<<<  ✨ Windsurf Command ⭐ >>>>>>>>>>>>>>>> */
/**
 * Remove a product from the compare list.
 * @param {number} productId - The id of the product to be removed.
 * @returns {void}
 */
/* <<<<<<<<<<  28e3b8ac-5537-4bb3-b62a-3f74305ec4fc  >>>>>>>>>>> */
export const removeFromCompare = (productId: number) => {
    const stored = localStorage.getItem('compareProducts');
    if (!stored) return;

    const products = JSON.parse(stored).filter((p: any) => p.id !== productId);
    localStorage.setItem('compareProducts', JSON.stringify(products));
};

export const getCompareProducts = () => {
    const stored = localStorage.getItem('compareProducts');
    return stored ? JSON.parse(stored) : [];
};
