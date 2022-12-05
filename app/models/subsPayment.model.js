module.exports = (sequelize, Sequelize) => {
    const SubsPayment = sequelize.define("subsPayment", {
      amount: {
        type: Sequelize.FLOAT
      },
      configuredPaymentDate: {
        type: Sequelize.STRING
      },
      paymentDate: {
        type: Sequelize.STRING
      },
      emmited: {
        type: Sequelize.ENUM("E","NE")
      }
    });
    return SubsPayment;
  };