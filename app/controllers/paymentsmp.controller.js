const axios = require('axios');
const {mercadopago} = require("../utils/mercadoPago");
const db = require("../models");
const { OPEN_READWRITE } = require("sqlite3");
const { user: User, subscription: Subscription, transactionPreference: TransactionPreference, transaction: Transaction, subscriptionState: SubscriptionState, transactionState: TransactionState, subscriptionStateHistoric: SubscriptionStateHistoric ,user_milestone: User_milestone} = db;
const Sequelize = db.Sequelize;
exports.createAndPayTransaction = async (req, res) => {
    console.log(req.body)
    var d = new Date();
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
      date = [year, month, day].join('-');
    if(Object.keys(req.body).length === 0){
      res.status(400).send({ message: "Empty request" });
      return 0;
    }
        let preference = {
            items: [
                {
                    title: "Donación de única vez", 
                    description: "Donación de " + req.body.amount + " pesos",
                    unit_price: req.body.amount,
                    quantity:1,
                }
            ],
            back_urls: {
                "success": "http://localhost:3000/resultadoDonacion",
                "failure": "http://localhost:3000/resultadoDonacion",
                "pending": "http://localhost:3000/resultadoDonacion"
            },
            payer: {
              name:req.body.name,
              surname:req.body.lastname,
          },
            auto_return: "all",
            binary_mode: true,
            statement_descriptor: "Donaciones Pata Pila",
            
        };
    mercadopago.preferences.create(preference)
		.then(async function (response) {
      console.log(response)
      try {
        const transaction = await Transaction.create({
          amount: req.body.amount,
          type: req.body.type,
          paymentDate: date,
          userId: req.body.userId,
          subscriptionId: req.body.subscriptionId,
        });
        if (transaction) {
          const transactionState = await TransactionState.create({
            state: "P",
             transactionId: transaction.id,
          });
          const transactionPreference = await TransactionPreference.create({
            preferenceId: response.body.id,
            transactionId: transaction.id,
          });
        res.send({
          url: response.body.init_point
        });
        }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
    }).catch(function (error) {
      console.log(error);
    });
};

exports.getPreference = async (req, res) => {
  console.log(req.body.id);
  mercadopago.preferences.get(req.body.id).then(response =>  res.send(response)).catch(error =>  res.send({ message: error.message }));
}