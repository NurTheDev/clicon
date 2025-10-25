const Database = require("../database/database")
const {Role, Permission} = require("../models/RBAC.model");

async function seedRoles() {
    try {
        await Database()
        // Remove old roles if needed
        await Role.deleteMany({});
        const adminPermissions = await Permission.find({});
        const userPermissions = await Permission.find({
            resource: {$in: ["product", "category", "subcategory", "brand", "order"]},
            action: "read"
        });
        const managerPermissions = await Permission.find({
            resource: {$in: ["product", "category", "subcategory", "brand", "order", "user", "coupon"]},
            action: {$in: ["create", "read", "update"]}
        });
        const readOnlyPermissions = await Permission.find({action: "read"});
        const rolesToSeed = [
            {
                name: "Admin",
                permissions: adminPermissions.map(p => p._id),
                description: "Administrator with full access to all resources.",
                isActive: true
            },
            {
                name: "User",
                permissions: userPermissions.map(p => p._id),
                description: "Regular user with read access to products, categories, subcategories, and brands.",
                isActive: true
            },
            {
                name: "Manager",
                permissions: managerPermissions.map(p => p._id),
                description: "Manager with create, read, and update access to key resources.",
                isActive: true
            }
        ]
        const insertedRoles = await Role.insertMany(rolesToSeed, { ordered: false });
        console.log(`✅ Seeded ${insertedRoles.length} roles successfully:`);
        insertedRoles.forEach(role => {
            console.log(`   - ${role.name} (${role.permissions.length} permissions)`);
        });
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding roles:", error.message);
        process.exit(1);
    }
}
seedRoles();