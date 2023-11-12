const Blog = require ('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require ('express-async-handler');
const { validateMongodbid } = require('../utils/validateMongodbid');


const createBlog = asyncHandler(async (req, res) =>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch (error) {
        throw new Error (error)
    }
})

const updateBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, 
            {new: true}
        );
        res.json(updateBlog)
    } catch (error) {
        throw new Error (error)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {numViews: 1},
            },
            { new: true,}
        );
        res.json(updateViews);
    } catch (error) {
        throw new Error (error)
    }
})

const getAllBlogs = asyncHandler (async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error (error);
    }
})

const deleteBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog)
    } catch (error) {
        throw new Error (error)
    }
})

const likeBlog = asyncHandler (async (req, res) => {
    const {blogId} = req.body;
    validateMongodbid(blogId);

    //find blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the logged in user
    const loginUserId = req?.user?._id;
    //check if user has already liked blog
    const isLiked = blog.isLiked;
    //find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId = userId?.toString() === loginUserId?.toString())
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        });
    }
});

module.exports = {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog}