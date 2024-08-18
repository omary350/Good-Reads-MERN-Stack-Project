const wrapAsync = require("../utils/wrapAsync")
const httpStatusText = require("../utils/httpStatusText")
const Author = require("../models/author.model")
const appError = require("../utils/appError")
const idGenerator = require("../utils/idGenerator")


const getAllAuthors= wrapAsync(async (req,res,next)=>{
    const authors = await Author.find({},{"__v": false,"_id":false})
    res.send(authors)
})

const getOneAuthor= wrapAsync(async (req,res,next)=>{
    const id = req.params.id
    const author = await Author.findOne({id})
    res.send(author)
})

const addAuthor= wrapAsync(async (req,res,next)=>{
    const {firstName, lastName, dob, photo} = req.body
    if (!firstName || !lastName ) {
        return next(new appError('Please provide all the required fields', 400));
    }
    const newId = await idGenerator(Author)
    const author = new Author({
        id:newId,
        firstName,
        lastName,
        dob,
        photo
    })
    await author.save()
    res.status(201).json({status: httpStatusText.SUCCESS, data: {author}})
})

const editAuthor = wrapAsync(async (req,res,next)=>{
    const id = req.params.id
    let author = await Author.findOne({id})
    if (!author) {
        return next(new appError('Author not found', 404));
    }
    Object.assign(author, req.body);
    await author.save()
    res.status(201).json({status: httpStatusText.SUCCESS, data: {author}})
})

const deleteAuthor = wrapAsync(async (req,res,next)=>{
    const id = req.params.id
    const author = await Author.findOne({id})
    if (!author) {
        return next(new appError('Author not found', 404,httpStatusText.FAIL));
    }
    await author.deleteOne({id})
    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
})

module.exports={
    getAllAuthors,
    getOneAuthor,
    addAuthor,
    editAuthor,
    deleteAuthor
}