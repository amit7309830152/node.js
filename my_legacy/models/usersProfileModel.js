const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone: {
        type: String,
        unique: false,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error('Phone number is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    otp: {
        type: Number,
    },
    gender: {
        type: String,
        lowercase: true,
    },
    hobbies: [{
        type: String,
        trim: true
    }],
    profession: [{
        type: String,
        trim: true
    }],
    dob: {
        type: Date,
        trim: true,
    },
    area: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true
    },
    postalCode: {
        type: Number,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    iAgree: {
        type: Number,
        trim: true,
        default: 0
    },
    isPhoneVerified: {
        type: Number,
        trim: true,
        default: 0
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

// to populate the family.
// userProfileSchema.virtual('family', {
//     ref: 'user_Family',
//     localField: '_id',
//     foreignField: 'user_id'
// })

// Hash the plain text password before saving
userProfileSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})



// userProfileSchema.methods.checkOldPassword = async(email, password) => {
//     const user = await UserProfile.findOne({ email })
//     if (!user) {
//         throw new Error('Unable to login')
//     }
//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return user
// }


userProfileSchema.statics.findByCredentials = async(email, password) => {
    const user = await UserProfile.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

const UserProfile = mongoose.model('user_profiles', userProfileSchema)

module.exports = UserProfile