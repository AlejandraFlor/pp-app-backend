const axios = require('axios');
const {mercadopago} = require("../utils/mercadoPago");
const { subscriptionStateHistoric, user } = require("../models");
const db = require("../models");
const { OPEN_READWRITE } = require("sqlite3");
const { user: User, subscription: Subscription, transaction: Transaction, subscriptionState: SubscriptionState, transactionState: TransactionState, subscriptionStateHistoric: SubscriptionStateHistoric ,user_milestone: User_milestone} = db;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const sequelize = new Sequelize('postgres://wtukelbehxinsv:d49ff7b066783cae788b94cab4b23d673cd689b8c3c8bb12fc80de824f73b503@ec2-3-220-207-90.compute-1.amazonaws.com:5432/dai8n8nsdbani8');

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
                "success": "http://localhost:3000/donar",
                "failure": "http://localhost:3000/donar",
                "pending": "http://localhost:3000/donar"
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
		.then(function (response) {
            console.log(response)
			res.send({
				url: response.body.init_point
			});
		}).catch(function (error) {
			console.log(error);
		});
      };
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

exports.getPreference = async (req, res) => {
  console.log(req.body.id);
  mercadopago.preferences.get(req.body.id).then(response =>  res.send(response)).catch(error =>  res.send({ message: error.message }));
}