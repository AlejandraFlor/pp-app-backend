const {DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('Image', {
    image: {
      type: DataTypes.BLOB('long'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    }
  });
  return Image;
};