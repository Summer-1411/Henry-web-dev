const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')

const  Post = require('../models/Post')


// @route POSt api/posts
// @desc Create post
// @access Private


router.post('/', verifyToken, async (req, res) => {
    const {title, description, url, status} =  req.body
    console.log(req.body);
    if(!title){
        return res.status(400).json({success: false, message: 'Title is required'})
    }

    try {
        const newPost = new Post({
            title,
            description, 
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        })

        await newPost.save()

        return res.json({ success: true, message: 'Happy learning', post: newPost })
    }catch(e){
        console.log(e);
        return res.status(500).json({success: false, message: 'Internal server error'})
        
    }
})


// @route GET api/posts
// @desc GET post
// @access Private

router.get('/', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', [
            'username'
        ])
        res.json({ success: true, posts })
    }catch(e){
        console.log(e);
        res.status(500).json({success: false, message: 'Internal server error'})

    }
})


// @route PUT api/posts
// @desc Update post
// @access Private

router.put('/:id', verifyToken, async(req, res) => {
    const {title, description, url, status} = req.body
    console.log(req.body);
    if(!title){
        return res.status(400).json({success: false, message: 'Title is required'})
    }

    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status:  status || 'TO LEARN'
        }

        const postUpdateCondition = {_id: req.params.id, user: req.userId}
        console.log(req.userId);
        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true})


        //Check: Nếu user không thoả mãn (User không được cấp qyền update)

        if(!updatedPost){
            return res.status(401).json({ success: false, message: 'Post not found or user not authorised'})
        }

        return res.json({ success: true, message: 'Update thanh cong', post: updatedPost })
    }catch(e){
        console.log(e);
        return res.status(500).json({success: false, message: 'Internal server error'})
        
    }
})


// @route DELETE api/posts
// @desc Delete post
// @access Private

router.delete('/:id', verifyToken, async (req,res) => {
    console.log(req.params.id);
    console.log(req.userId);
    try {

        const postDeleteConditon = {_id: req.params.id, user: req.userId}
        const deletedPost = await Post.findOneAndDelete(postDeleteConditon)

        //Check: Nếu user không thoả mãn (User không được cấp qyền delete)
        if(!deletedPost){
            return res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised'
            })
        }

        res.json({ success: true, message: 'Delete post success', post: deletedPost})

    }catch(e){
        console.log(e);
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
})


module.exports = router