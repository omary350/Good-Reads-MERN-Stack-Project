const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wraper");
const Category = require("../models/category.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult } = require("express-validator");
const wordTransform = require("../utils/wordTransform");


const getCategory =   wrapAsync(async (req, res, next) => {
    const categories = await Category.find({}, { __v: false });
    res.status(200).json({status: httpStatusText.SUCCESS , data:{categories}})
});

const addCategory = wrapAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new appError (errors.array(), 400, httpStatusText.FAIL));
    }
    let categoryName =  wordTransform(req.body.name);  
    const ifCategoryExist = await Category.findOne({ name: categoryName });
    if (ifCategoryExist) {
      return next(new appError(`Category ${ifCategoryExist.name} already exists`, 400 , httpStatusText.FAIL));
    }
    const lastCategory = await Category.findOne().sort({ id: -1 });
    let newId = lastCategory? lastCategory.id + 1 : 1;
    const category = new Category({
      id: newId,
      name: categoryName,
    });

    try{
        const ifSaved = await category.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data:{ifSaved} });
    }catch(err){
        return next(new appError(err.message, 400, httpStatusText.FAIL))
    }

  })

const updateCategory = wrapAsync(async (req , res , next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new appError (errors.array(), 400, httpStatusText.FAIL));
    }
    const categoryId = +req.params.id;
    const newCategoryName =  wordTransform(req.body.name); 
    try{
      const updatedCategory = await Category.findOneAndUpdate({id:categoryId} ,{name: newCategoryName } , {new: true , runValidators: true});
      res.status(200).json({status: httpStatusText.SUCCESS , data:{updatedCategory}});
    }catch(err){
      return next(new appError(err.message, 400, httpStatusText.FAIL))
    }    
})

const deleteCategory = wrapAsync(async(req , res , next)=>{
  const categoryId = +req.params.id;
  try{
     const ifDeleted = await Category.findOneAndDelete({id: categoryId});
     res.status(200).json({status: httpStatusText.SUCCESS , data:{ifDeleted}});
  }catch(err){
      return next(new appError(err.message, 400, httpStatusText.FAIL))
  }
 
})
module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory,
}