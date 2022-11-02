require('dotenv').config()
const express =require('express')

const router = express.Router()

const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verifyToken = require('../middleware/auth')


//const Test = require('../models/Test')

// @route POSt api/posts
// @desc Create post
// @access Private

// router.post('/test', async (req, res) => {
//     const { title } = req.body
//     try {
//         const newTest = new Test({
//             title: title
//         })
//         await newTest.save()

//         const accessToken1 = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET1)

//         res.json({ success: true, message: 'Good'}, accessToken1)
//     }catch(e){
//         console.log(e);
//         res.status(500).json({success: false, message: 'Internal server error'})
//     }
// })

//@Router GET ap/auth
//@desc Check if user logged in
//@access Public

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if(!user){
            return res.status(400).json({ success: false, message: 'user not found' })
        }
        return res.json({ success: true, message: 'Ok',user })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error vai lol'})
    }
})



// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
    const {username, password} = req.body

    //Simple validation
    if(!username || !password){
        return res.status(400).json({success : false, message: 'Missing parameter'})
    }

    try {
        //check for existing user
        const user = await User.findOne({username})

        if(user){
            return res.status(400).json({success: false, message: 'User da ton tai !'})
        }

        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username, password: hashedPassword
        })

        await newUser.save()

        // return token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)

        res.json({success: true, message: 'Dang ky thanh cong', accessToken})
    }catch(e){
        console.log(e);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// @route POST api/auth/login
// @desc Register user
// @access Public

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    //Simple validation
    if(!username || !password){
        return res.status(400).json({success : false, message: 'Missing parameter'})
    }

    try {
        //Check user ton tai hay k ?
        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({success: false, message: 'Tai khoan khong ton tai !'})
        }

        //Username found
        const passwordValid = await argon2.verify(user.password, password)

        if(!passwordValid){
            return res.status(400).json({ success: false, message: 'Mat khau k chinh xac !' })
        }

        // All good
        // Return token
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: 'Dang nhap thanh cong', accessToken})


    }catch(e){
        console.log(e);
        res.status(500).json({success: false, message: 'Internal server error'})
    }

})



router.get('/', (req, res) => res.send('User route'))

module.exports = router