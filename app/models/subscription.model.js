module.exports = (sequelize, Sequelize) => {
    const Subscription = sequelize.define("subscription", {
      amount: {
        type: Sequelize.FLOAT
      },
      frequency: {
        type: Sequelize.INTEGER
      },
      lastPaymentDate: {
        type: Sequelize.STRING
      },
      nextPaymentDate: {
        type: Sequelize.STRING
      },
      mpSubscriptionId: {
        type: Sequelize.STRING  
      }
    });
    return Subscription;
  };