module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      read: {
        type: Sequelize.ENUM("R","NR")
      }
    });
    return Notification;
  };