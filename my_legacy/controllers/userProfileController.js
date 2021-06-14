// var db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/usersProfileModel')
const Email = require('../emails/email')

const UserFamily = require('../models/userFamilyModel');
const { response } = require('express');

exports.registerUser = async(req, res) => {
    if (!req.body.email) {
        res.status(400).send({ status: false, message: 'Please enter the email' })
    }
    if (!req.body.password) {
        res.status(400).send({ status: false, message: 'Please enter the password' })
    }

    dataToEnter = {
        email: req.body.email,
        password: req.body.password,
    }

    try {
        const user = new UserProfile(dataToEnter)
        var token = jwt.sign({
            email: user.email,
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_SECRET_KEY_EXPIRE_TIME
        });
        saveResult = await user.save()
            // send mail on 
            // sendMail = await Email.sendMail(req.body.email, 'Welcome message', 'Thankyou for the registration', )
        res.status(201).send({ status: true, message: 'New user saved successfully', data: { token } })
    } catch (error) {
        if (error.code === 11000) {
            errorKeys = Object.keys(error.keyPattern)[0]
            if (errorKeys == 'phone') {
                return res.status(400).send({ status: false, message: 'This phone number is already exist' })
            }
            if (errorKeys == 'email') {
                return res.status(400).send({ status: false, message: 'This email is already exist' })
            }
            return res.status(400).send({ status: false, message: 'Something went wrong', error })
        }
        return res.status(400).send({ status: false, message: 'Something went wrong', error })
    }
}

exports.registerDetailOne = async(req, res) => {

    if (!req.body.firstName) {
        return res.status(400).send({ status: false, message: 'Please enter the first name' })
    }
    if (!req.body.area) {
        return res.status(400).send({ status: false, message: 'Please enter the area' })
    }
    if (!req.body.country) {
        return res.status(400).send({ status: false, message: 'Please enter the country' })
    }
    if (!req.body.postalCode) {
        return res.status(400).send({ status: false, message: 'Please enter the postalCode' })
    }


    updateData = {
        firstName: req.body.firstName,
        area: req.body.area,
        country: req.body.country,
        postalCode: req.body.postalCode,
        lastName: req.body.lastName
    }

    try {
        updateResult = await UserProfile.findOneAndUpdate({ _id: req.tokenDetail.id }, updateData);
        return res.status(200).send({ status: true, message: 'Update successfull' })
    } catch (error) {
        if (error) {
            return res.status(500).send({ status: false, message: 'Invalid date format for date of birth, please enter as MM-DD-YYYY' })
        }
        return res.status(500).send({ status: false, message: 'Something went wrong', error })
    }
}

exports.registerDetailTwo = async(req, res) => {
    if (!req.body.dob) {
        return res.status(400).send({ status: false, message: 'Please enter the date of birth' })
    }

    updateData = {
        hobbies: req.body.hobbies,
        profession: req.body.profession,
        dob: req.body.dob,
        gender: req.body.gender,
    }

    try {
        updateResult = await UserProfile.findOneAndUpdate({ _id: req.tokenDetail.id }, updateData);
        return res.status(200).send({ status: true, message: 'Update successfull' })
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Something went wrong', error })
    }
}

exports.registerPhone = async(req, res) => {
    if (!req.body.phone) {
        return res.status(400).send({ status: false, message: 'Please enter the phone number' })
    }
    try {
        // check if the phone number is already exist
        const user = await UserProfile.findOne({ phone: req.body.phone })
        if (user != null) {
            return res.status(400).send({ status: false, message: 'This phone number is already taken' })
        }
        let otp = Math.floor(Math.random() * 90000) + 10000;
        updateData = {
            phone: req.body.phone,
            otp: otp
        }
        updateResult = await UserProfile.findOneAndUpdate({ _id: req.tokenDetail.id }, updateData, { new: true, runValidators: true });
        // now send sms if the phn is saved successfully
        return res.status(200).send({ status: true, message: 'OTP is sent to this mobile number.' })
    } catch (error) {
        return res.status(500).send({ status: false, message: 'OTP could not be sent, Something went wrong', error })
    }
}

exports.verifyPhone = async(req, res) => {
    if (!req.body.otp) {
        return res.status(400).send({ status: false, message: 'Please enter the otp' })
    }
    try {
        const user = await UserProfile.findOne({ _id: req.tokenDetail.id })
        if ((user.otp != req.body.otp) || (req.body.otp == -1)) {
            return res.status(401).send({ status: false, message: 'OTP is incorrect' })
        }
        user.otp = -1
        user.isPhoneVerified = 1
        await user.save()
        return res.status(200).send({ status: true, message: 'Phone number is verified' })
    } catch (error) {
        return res.status(500).send({ status: false, message: 'OTP could not be sent, Something went wrong', error })
    }
}

exports.loginUser = async(req, res) => {
    try {
        const user = await UserProfile.findByCredentials(req.body.email, req.body.password)
        userDetail = user
        var token = jwt.sign({
            email: user.email,
            phone: user.phone,
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_SECRET_KEY_EXPIRE_TIME
        });
        res.status(200).send({ status: true, message: 'Loged in successfully', data: { id: user._id, email: user.email, phone: user.phone, token } })
    } catch (error) {
        res.status(400).send({ status: true, message: 'Username or password is wrong', error })
    }
}

exports.updateProfile = async(req, res) => {
    userProfileDetail = req.body
    delete userProfileDetail.email
    delete userProfileDetail.phone
    delete userProfileDetail.password
    try {
        updateResult = await UserProfile.findOneAndUpdate({ _id: req.tokenDetail.id }, userProfileDetail);
        return res.status(200).send({ status: true, message: 'Update successfull' })
    } catch (error) {
        if (error) {
            return res.status(500).send({ status: false, message: 'Invalid date format for date of birth, please enter as MM-DD-YYYY' })
        }
        return res.status(500).send({ status: false, message: 'Something went wrong', error })
    }
}

// exports.getUserProfile = async(req, res) => {
//     try {
//         tokenDetail = req.tokenDetail
//         userProfileDetail = await UserProfile.findById(tokenDetail.id).populate('family')
//         await userProfileDetail.populate('Family').execPopulate()
//         final_data = { userProfileDetail, family: userProfileDetail.family[0] }

//         // console.log(Object.value(userProfileDetail))
//         // userProfileDetail = await userProfileDetail.toJSON()
//         // userProfileDetail.family = 'asdfasfd'

//         // userProfileDetail = await (UserProfile.findById(tokenDetail.id).populate('user_Family').execPopulate())

//         // delete userProfileDetail.created_at
//         // delete userProfileDetail.updated_at
//         // delete userProfileDetail.password
//         // delete userProfileDetail.__v

//         return res.status(200).send({ status: true, message: 'success', data: final_data })
//     } catch (error) {
//         res.status(400).send({ status: false, message: 'Username or password is wrong', error })
//     }
// }

exports.getUserProfile = async(req, res) => {
    try {
        tokenDetail = req.tokenDetail
        userProfileDetail = (await UserProfile.findById(tokenDetail.id)).toJSON()
        delete userProfileDetail.created_at
        delete userProfileDetail.updated_at
        delete userProfileDetail.password
        delete userProfileDetail.__v

        return res.status(200).send({ status: true, message: true, data: userProfileDetail })
    } catch (error) {
        res.status(400).send({ status: false, message: 'Username or password is wrong', error })
    }
}

/*
Change password by old password 
{{local}}/api/user/profile/changePassword
 */

exports.changePassword = async(req, res) => {
    if (!req.body.oldPassword) {
        return res.status(400).send({ status: false, message: 'Please enter the old password' })
    }
    if (!req.body.newPassword) {
        return res.status(400).send({ status: false, message: 'Please enter the new password' })
    }
    try {
        const user = await UserProfile.findByCredentials(req.tokenDetail.email, req.body.oldPassword)
        user.password = req.body.newPassword
        await user.save()
        return res.status(200).send({ status: true, message: 'Password has been changed successfully' })
    } catch (error) {
        return res.status(401).send({ status: false, message: 'Password is Invalid', error })
    }
}

exports.sendOtpChangePassword = async(req, res) => {
    let email;
    if (!req.body.email) {
        return res.status(400).send({ status: false, message: 'Email is missing' })
    } else {
        email = req.body.email
    }
    try {
        let otp = Math.floor(Math.random() * 90000) + 10000;
        let user = await UserProfile.findOne({ email: email })
        if (user == null) {
            return res.status(401).send({ status: false, message: 'This email is not register please enter the registered email' })
        } else {
            user.otp = otp;
            await user.save();
        }
        isEmailSent = await Email.sendMail(email, 'OTP for my legacy change password', `Your OTP to change password is ${otp}`)
        if (isEmailSent) {
            return res.status(200).send({ status: true, message: 'Email is sent with otp' })
        } else {
            return res.status(500).send({ status: false, message: 'Something went wrong', error })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Something went wrong', error })
    }
}

exports.verifyOtpChangePassword = async(req, res) => {
    if (!req.body.email) {
        return res.status(400).send({ status: false, message: 'Email is missing' })
    } else {
        email = req.body.email
    }

    if (!req.body.newPassword) {
        return res.status(400).send({ status: false, message: 'New Password is missing' })
    } else {
        newPassword = req.body.newPassword
    }

    if (!req.body.otp) {
        return res.status(400).send({ status: false, message: 'OTP is missing' })
    } else {
        otp = req.body.otp
    }
    try {
        user = await UserProfile.findOne({ email: email })
        if (user.otp == otp) {
            user.password = newPassword
            await user.save();
            return res.status(200).send({ status: true, message: 'Password is changed successfully' })
        } else {
            return res.status(401).send({ status: false, message: 'Otp is invalid' })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Something went wrong' })
    }

}

// exports.loginFb = async(req, res) => {

// }