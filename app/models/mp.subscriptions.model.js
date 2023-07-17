module.exports = (sequelize, Sequelize) => {
    const MpSubscriptions = sequelize.define("mpSubscriptions", {
      token: {
        type: Sequelize.STRING,
      },
    });
    return  MpSubscriptions;
  };