module.exports = (sequelize, Sequelize) => {
    const TransactionPreference = sequelize.define("transactionPreference", {
        preferenceId: {
            type: Sequelize.STRING
          }
    });
    return TransactionPreference;
  };