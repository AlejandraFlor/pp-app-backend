const controller = require("../controllers/image.controller");
const db = require("../models");
const multer = require('multer');
const path = require('path');


const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, '../images'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileUpload = multer({ storage: diskStorage }).single('image');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/images/upload", fileUpload,controller.uploadImage);
  //app.post("/api/images/upload", controller.uploadImage);
  app.get("/api/images/:id", controller.getImage);
};