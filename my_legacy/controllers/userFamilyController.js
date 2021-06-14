const UserProfile = require('../models/usersProfileModel')
const mongoose = require('mongoose')
const UserFamily = require('../models/userFamilyModel')

exports.setNewMemmber = async(req, res) => {
    try {
        if (req.body.memberId) {
            resultSave = await UserFamily.findByIdAndUpdate(req.body.memberId, req.body, {
                returnOriginal: true,
                runValidators: true,
                select: 'name user_id detail relationType parent',
                useFindAndModify: false
            })
        } else {
            newMember = new UserFamily(req.body)
            resultSave = await newMember.save()
        }
        return res.status(201).send({ status: true, message: 'saved successully', data: { resultSave } })
    } catch (error) {
        return res.status(400).send({ status: false, message: 'failed', error })
    }
}

exports.getAllFamilyMembers = async(req, res) => {
    tokenDetail = req.tokenDetail

    userProfileDetail = await UserProfile.aggregate(
        [
            { $match: { "_id": mongoose.Types.ObjectId(tokenDetail.id) } },
            {
                $lookup: {
                    from: 'user_families',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'families'
                }
            },
            {
                $unwind: "$families"
            },
            {
                $project: { _id: 1, firstName: 1, families: 1 },
            },
        ]
    )
    return res.send(userProfileDetail)
}

exports.getMemberDetail = async(req, res) => {
    if (!req.body.memberId) {
        return res.status(400).send({ status: false, message: 'memberId is missing' })
    }

    let memberDetail = await UserFamily.findById(req.body.memberId, '_id user_id parent name detail')
    return res.status(200).send({ status: true, message: 'success', data: memberDetail })

}