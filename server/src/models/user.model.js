const mongoose = require("mongoose");
const {genSalt, hash, compare} = require("bcrypt");
const {Schema, Types} = mongoose;
const customError = require("../utils/customError");

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String, required: true, trim: true,
    }, bio: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
    }, password: {
        type: String, required: true, trim: true,
    }, role: {
        type: String, enum: ["user", "admin", "superadmin", "moderator", "guest",], default: "user"
    }, createdAt: {
        type: Date, default: Date.now
    }, updatedAt: {
        type: Date, default: Date.now
    }, image: String, isEmailVerified: {
        type: Boolean, default: false
    }, isPhoneVerified: {
        type: Boolean, default: false
    }, isActive: {
        type: Boolean, default: true
    }, isBlocked: {
        type: Boolean, default: false
    }, address: {
        type: String, default: "N/A"
    }, city: {
        type: String, trim: true, default: "N/A"
    }, state: {
        type: String, default: "N/A", trim: true
    }, country: {
        type: String, default: "Bangladesh"
    }, zipCode: {
        type: String, trim: true
    }, phone: {
        type: String, trim: true,
        match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"]
    }, dateOfBirth: Date, gender: {
        type: String, enum: ["male", "female", "other"]
    }, lastLoginAt: Date, lastLogOutAt: Date,
    wishList: [{type: Types.ObjectId, ref: "wishList"}],
    cart: [{type: Types.ObjectId, ref: "cart"}],
    order: [{type: Types.ObjectId, ref: "order"}],
    newsLetter: {type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    phoneVerificationToken: String,
    phoneVerificationExpire: Date,
    refreshToken: String,
    refreshTokenExpire: Date,
    isTwoFactorEnabled: {type: Boolean, default: false}
}, {
    timestamps: true,
    versionKey: false
})
// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            const salt = await genSalt(10);
            this.password = await hash(this.password, salt);
        }
        next()
    } catch (error) {
        next(error)
    }
})

// Compare password
userSchema.methods.checkPassword = async function (password) {
    try {
        return await compare(password, this.password)
    } catch (error) {
       throw new customError(error.message, 400)
    }
}

// Check if the Email is unique
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("email")) {
            const user = await this.constructor.findOne({email: this.email});
            if (user && user._id.toString() !== this._id.toString()) {
                return next(new customError("Email already exists", 400))
            }
        }
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = mongoose.model("user", userSchema);
