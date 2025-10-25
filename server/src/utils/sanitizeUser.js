/**
 * Remove sensitive data from user object before sending response
 * @param {Object} user - User document from database
 * @returns {Object} - Sanitized user object
 */

const sanitizeUser = (user)=>{
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        role: user.role,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country
    }
}

module.exports = sanitizeUser