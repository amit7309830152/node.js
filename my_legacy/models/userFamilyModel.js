const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userFamilySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user_Profile'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    detail: {
        type: String,
        trim: true
    },
    relationType: {
        type: String,
        trim: true
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

const UserFamily = mongoose.model('user_families', userFamilySchema)

module.exports = UserFamily