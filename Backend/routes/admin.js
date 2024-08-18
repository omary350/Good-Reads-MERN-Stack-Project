const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin.controller")
const bookController = require("../controllers/book.controller")
const authorController = require("../controllers/author.controller")
const categoryController = require("../controllers/category.controller")
const isValidCategReq = require("../middlewares/isValiedCategRequest")
const Category = require("../models/category.model")



router.post("/register",adminController.createAdmin)

router.post("/login",adminController.loginAdmin)

router.patch("/:username/edit",adminController.editAdmin)

router.get("/book",bookController.getAllBooks)

router.post("/book/add",bookController.addBook)

router.patch("/book/:id/edit",bookController.editBook)

router.delete("/book/:id/delete",bookController.deleteBook)
 
router.get("/author",authorController.getAllAuthors)

router.get("/author/:id",authorController.getOneAuthor)

router.post("/author/add",authorController.addAuthor)

router.patch("/author/:id/edit",authorController.editAuthor)

router.delete("/author/:id/delete",authorController.deleteAuthor)

router.get("/category", categoryController.getCategory);

router.post( "/category/add", isValidCategReq.addCategoryValidation() , categoryController.addCategory);

router.patch("/category/:id/edit" , isValidCategReq.addCategoryValidation() , categoryController.updateCategory)

router.delete("/category/:id/delete" , categoryController.deleteCategory)


module.exports = router;
