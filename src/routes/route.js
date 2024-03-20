const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const path = require ('path');
const md5 = require('md5');

// Set up Multer for file uploads
let upload = '';
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log('file uploding --------------')
        console.log(file);
        if (file.fieldname == "profile_picture") {
            callback(null, path.join(__dirname, ".", "../../src/uploads/adminImage"));
        }else  {
            callback(null, path.join(__dirname, ".", "../../src/uploads/adminImage"));
        }
    },
    filename: function (req, file, callback) {
        //   console.log("file-----",file)
        let fileUniqueName = md5(Date.now());
        callback(null, fileUniqueName + path.extname(file.originalname));
    }
});
upload = multer({ storage: storage });
router.use(upload.any());

// console.log('__dirname', __dirname);
//postman path is http://localhost:3000/hello
router.get('/hello', authController.hello);
router.post('/register', authController.register);
router.post('/loginBy', authController.loginBy);
router.get('/getUserList', authController.getUserList);

module.exports = router;