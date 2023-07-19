const db = require("../models");
const path = require('path');
const fs = require('fs');
const {image: Image} = db;
const Sequelize = db.Sequelize;

exports.uploadImage = async (req, res) => {
  console.log(req.file)
  console.log(req.body.user_id)

  const type = req.file.mimetype;
  const name = req.file.originalname;
  const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename));
  Image.findOne({
    where: {
      userId: req.body.user_id
    }
  }).then(async (image) => {
    if(image){
      console.log(image)
      Image.upsert({
        image: data,
        name: name,
        type: type,
        id: image.id,
      }).then(() => {
        return res.status(200).json({ message: 'Image updated successfully!' });
      }).catch(err => {
        return res.status(500).json({ message: err.message });
      });
    }
    else{
      try{
        const image = await Image.create({
          image: data,
          name: name,
          type: type,
          userId: req.body.user_id
        });
        if(image){
          console.log(image)
          return res.status(200).json({ message: 'Image uploaded successfully!' });
        }
        return res.status(500).json({ message: 'Not found' });
      }
      catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message });
      }
    }
  }).catch(err => {
    return res.status(500).json({ message: err.message });
  });
};


// API endpoint to retrieve an image by ID
exports.getImage = async (req, res) => {
  console.log("llamada")
  console.log(req.params)
  user_id =  req.params.id;
  console.log(user_id)
  Image.findOne({
    where: { 
      userId: user_id
    }
  }).then(async (image) => 
  {
    if(image){
      fs.writeFileSync(path.join(__dirname, '../../dbimages/' + user_id + '-profile-p.png'), image.image);
      const imgDir = fs.readdirSync(path.join(__dirname, '../../dbimages/'));
      return res.status(200).send(`http://localhost:8080/${user_id}-profile-p.png`);
    }
    else{
      return res.status(200).json(null);
    }
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};