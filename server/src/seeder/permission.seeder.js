const Database = require("../database/database");
const {Permission} = require("../models/RBAC.model");

async function seedPermissions() {
    try {
        await Database(); // Ensure DB connection
        // Remove old permissions if needed
        await Permission.deleteMany({});
        const resources = [
            "brand", "cart", "order", "product", "user",
            "category", "coupon", "review", "deliveryCharge",
            "RBAC", "discount", "payment", "wishlist",
            "subcategory", "variant", "warehouse"
        ];
        const actions = ["create", "read", "update", "delete"];
        const permissionsToSeed = [];
        resources.forEach(resource => {
            actions.forEach(action => {
                permissionsToSeed.push({
                    resource,
                    action,
                    description: `${action.charAt(0).toUpperCase() + action.slice(1)} permission for ${resource}`
                })
            })
        })
        await Permission.insertMany(permissionsToSeed, {ordered: false});
        console.log(`Seeded ${permissionsToSeed.length} permissions successfully.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding permissions:", error);
        process.exit(1);
    }
}
seedPermissions();