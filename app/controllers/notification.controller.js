const db = require("../models");
const { notification: Notification, user: User, subscription: Subscription, transaction: Transaction, subscriptionState: SubscriptionState, transactionState: TransactionState, subscriptionStateHistoric: SubscriptionStateHistoric, milestone:Milestone} = db;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;

exports.createNotification = async (req, res) => {
    try {
      const notification = await Notification.create({
        title: req.body.title,
        description:req.body.description,
        read:"NR",
      });
      if (!notification) {
        return res.status(500).send({ message: "Error creating notification" });
      };
      res.send({ message: "Notification created successfully!" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  exports.getNotifications = async (req, res) => {
      Notification.findAll({
      })
      .then(async (userData) => {
        res.status(200).send(userData);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
  };

  exports.readNotifications = async (req, res) => {
    Notification.update(
      {
        read: "R",
      },
      {
        where: { id: req.body.id },
      }
    )
    .then(async (userData) => {
      res.send({ message: "Notification read successfully!" });
      }).catch(err => {
          res.status(500).send({ message: err.message });
      });
};

  exports.deleteNotification = async (req, res) => {
    Notification.destroy({
      where: {
        id: req.body.id
      }
    })
    .then(async (statusCode) => {
      res.send({ message: "Notification deleted successfully!" });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
  }