const Database = require("../database/database");
const { Role, Permission } = require("../models/RBAC.model");

async function seedRoles() {
  try {
    await Database();

    console.log("🔄 Starting role seeding...");

    // Remove old roles if needed
    await Role.deleteMany({});
    console.log("🗑️  Cleared existing roles");

    // Fetch all permissions
    const allPermissions = await Permission.find({});
    console.log(`📋 Found ${allPermissions.length} total permissions`);

    if (allPermissions.length === 0) {
      console.error(
        "❌ No permissions found! Please run permission seeder first."
      );
      process.exit(1);
    }

    // Admin: All permissions
    const adminPermissions = allPermissions;

    // User: Read-only access to specific resources
    const userPermissions = await Permission.find({
      resource: {
        $in: [
          "product",
          "category",
          "subcategory",
          "brand",
          "order",
          "banner",
          "review",
        ],
      },
      action: "read",
    });

    // Manager: Create, read, update access to key resources
    const managerPermissions = await Permission.find({
      resource: {
        $in: [
          "product",
          "category",
          "subcategory",
          "brand",
          "order",
          "user",
          "coupon",
        ],
      },
      action: { $in: ["create", "read", "update"] },
    });

    console.log(`📊 Permission counts:`);
    console.log(`   - Admin: ${adminPermissions.length} permissions`);
    console.log(`   - User: ${userPermissions.length} permissions`);
    console.log(`   - Manager: ${managerPermissions.length} permissions`);

    // Define roles to seed
    const rolesToSeed = [
      {
        name: "Admin",
        permissions: adminPermissions.map((p) => p._id),
        description: "Administrator with full access to all resources.",
        isActive: true,
      },
      {
        name: "User",
        permissions: userPermissions.map((p) => p._id),
        description:
          "Regular user with read access to products, categories, subcategories, and brands.",
        isActive: true,
      },
      {
        name: "Manager",
        permissions: managerPermissions.map((p) => p._id),
        description:
          "Manager with create, read, and update access to key resources.",
        isActive: true,
      },
    ];

    // Insert roles
    const insertedRoles = await Role.insertMany(rolesToSeed, {
      ordered: false,
    });

    console.log(`\n✅ Seeded ${insertedRoles.length} roles successfully:`);

    // Safe logging - check if permissions exist before accessing length
    insertedRoles.forEach((role) => {
      const permCount = role.permissions?.length || 0;
      console.log(`   - ${role.name} (${permCount} permissions)`);
    });

    // Optional: Verify by fetching populated roles
    console.log("\n🔍 Verifying seeded roles...");
    const verifyRoles = await Role.find({}).populate("permissions");
    verifyRoles.forEach((role) => {
      console.log(
        `   ✓ ${role.name}: ${role.permissions.length} permissions, Active: ${role.isActive}`
      );
    });

    console.log("\n🎉 Role seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

seedRoles();
