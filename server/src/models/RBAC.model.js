const mongoose = require('mongoose');
const {Schema, Types} = mongoose;

// Define Role Schema
const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
}, {timestamps: true});

const permissionSchema = new Schema({
    resource: {
        type: String,
        required: true,
        trim: true
    },
    action: {
        type: String,
        required: true,
        enum: ["create", "update", "delete", "read"],
        default: "read"
    },
    description: String,
    conditions: {type: Map, of: Schema.Types.Mixed},
    scope: {
        type: String,
        enum: ["all", "own", "department", "none"],
        default: "all"
    }
}, {timestamps: true});
// Add compound index for unique permission combinations
permissionSchema.index({resource: 1, action: 1}, {unique: true});

module.exports.Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
module.exports.Permission = mongoose.models.Permission || mongoose.model('permission', permissionSchema);