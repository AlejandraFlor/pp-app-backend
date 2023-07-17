var mercadopago = require('mercadopago');
const db = require("../models");
mercadopago.configurations.setAccessToken("APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791");
const axios = require('axios');
const { findUserById } = require('./auth.controller');
const {user: User, mpSubscription: MpSubscriptions} = db;
const Sequelize = db.Sequelize;


/*exports.createSubscription = async (req, res) => {
    axios.post('https://api.mercadopago.com/preapproval', data_subs, {
    headers: {
        'Authorization': 'Bearer TEST-8339819919751489-070916-7420a21a5abfda61786206d2327e72ac-1418606791',
        'Content-Type': 'application/json'
    }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
};*/

exports.createPlan = async (req, res) => {
  data = req.body
  axios.post('https://api.mercadopago.com/preapproval_plan', data, {
    headers: {
      'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response.data);
      res.status(200).send({ message: response.data });
    })
    .catch(error => {
      console.log(error)
      res.status(500).send({ message: error.message });
    });
};

exports.getPlan = async (req, res) => {
    axios.get('https://api.mercadopago.com/preapproval_plan/search', {
    headers: {
        'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791'
    }
    })
    .then(response => {
        console.log(response.data);
        res.send(response.data)
    })
    .catch(error => {
        console.error(error);
    });

}

exports.mpFindSubscription = async (req, res) => {
  axios.get('https://api.mercadopago.com/preapproval/search', {
  headers: {
    'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791'
  }})
  .then(response => {
    // Handle the response data
    console.log(response.data);
    res.send(response.data)
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
    res.status(500).send({ message: error.message });
  });
}

exports.mpCheckout = async (req, res) => {
    console.log(req.body)
    card_data = req.body.data
    token = card_data.token
    email = card_data.payer.email
    user_id = req.body.user_id

    const data_subs = {
      preapproval_plan_id: '2c938084894f5e43018951913d3d00ab',
      reason: 'Subscripcion Mensual',
      payer_email: email,
      card_token_id: token,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        start_date: '2023-08-20T13:16:40.018-04:00',
        end_date: '2025-07-16T13:16:40.018-04:00',
        transaction_amount: req.body.amount,
        currency_id: 'ARS'
      },
      back_url: 'https://www.mercadopago.com.ar',
      status: 'authorized'
    };
    console.log(data_subs)

    axios.post('https://api.mercadopago.com/preapproval', data_subs, {
    headers: {
        'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791',
        'Content-Type': 'application/json'
    }
    })
    .then(response => {
        console.log(response.data);
        try{
          const mpSubscription = MpSubscriptions.create({  
            token: response.data.id,
            userId: user_id,
          });
          if(mpSubscription){
            User.findOne({
              where: {
                id: user_id
              }
            }).then(async (user) => {
              axios.post('http://localhost:8080/api/payment/createSubscription', {
                userId: user_id,
                amount: 980,
                type: "mensual",
                frequency: 1,
                nextPaymentDay: "2023-11-07T13:07:14.260Z",
              }).then(response => {
                console.log(response.data);
              }).catch(err => {
                res.status(500).send({ message: err.message });
              });
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
            res.status(200).send({ message: response.data });
          }
        }catch(error){
          console.log(error)
          res.status(500).send({ message: error.message });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send({ message: error.message });
    });
    /*mercadopago.payment.save(req.body)
    .then(function(response) {
        console.log("ok")
        console.log(response)
        const { status, status_detail, id } = response.body;
        res.status(response.status).json({ status, status_detail, id });
    })
    .catch(function(error) {
        console.log("error")
        console.log(error)
        res.status(500).send({ message: error.message });
    });*/
}
    /**/
findMpSubscription = async(id)=> {
  axios.get(`https://api.mercadopago.com/preapproval/${id}`, {
    headers: {
      'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791'
    }
  })
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.error(error);
    return error
  });
}


exports.getAllMpSubscriptions = async (req, res) => {
  var subs = []
  items = 0
  MpSubscriptions.findAll({
    limit: req.body.limit,
    offset: req.body.offset
  })
  .then(async (mpSubscription) => {
    if(mpSubscription){
      mpSubscription.forEach(element => {
        console.log(element.token)
        axios.get(`https://api.mercadopago.com/preapproval/${element.token}`, {
          headers: { 'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791' }
        })
        .then(response => {
          if(response.data.status == "cancelled"){
            state = "C"
          }
          else if(response.data.status == "authorized"){
            state = "A"
          }
          else{ state = "P"}
          data = {
            id: response.data.id,
            status: response.data.status,
            amount: response.data.auto_recurring.transaction_amount,
            lastPaymentDate: response.data.summarized.last_charged_date,
            nextPaymentDate: response.data.next_payment_date.substring(0,10),
            frequency: 1,
            userId: element.userId,
            subscriptionState: {
              state: state
            }
          }
          subs.push(data)
          items = items + 1
          if (items == mpSubscription.length){
            return res.status(200).send(subs);
          }
        });
      });
    }
    else{
      res.status(200).send({ message: "Subscriptions not found" });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  }
  );
}
exports.getAllSubs = async (req, res) => {
  console.log("getAllMpSubscriptions")
  data = {limit: req.body.limit, offset: req.body.offset}
  axios.get(`https://api.mercadopago.com/preapproval/search?limit=${req.body.limit}&offset=${req.body.offset}`, {
  headers: {
    'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791'
  }})
  .then(response => {
    subs = []
    response.data.results.forEach(element => {
      console.log(element.id)
      MpSubscriptions.findOne({
        where: {
          token: element.id
      }}).
      then(async (mpSubscription) => {
        if(mpSubscription){
          var data = {
            id: element.id,
            status: element.status,
            amount: element.auto_recurring.transaction_amount,
            lastPaymentDay: element.start_date,
            nextPaymentDay: element.next_payment_date,
            frequency: 1,
            userId: 1,
            subscriptionState: {
              state: "A"
            }
          }
          subs.push(data)
        }
      });
    });
    res.status(200).send(subs);
  })
  .catch(error => {
    console.error(error);
    return res.status(404).send({ message: "Subscriptions not found" })
  });
}

exports.getMpSubscription = async (req, res) => {
  console.log(req.body)
    const user_id = req.body.userId;
    console.log(user_id)
    MpSubscriptions.findAll({
      where: {
        userId: user_id
      }
    }).then(async (mpSubscription) => {
      if(mpSubscription){
        mpSubscription = mpSubscription[mpSubscription.length-1]
        console.log(mpSubscription)
        axios.get(`https://api.mercadopago.com/preapproval/${mpSubscription.token}`, {
          headers: {
            'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791'
          }
        })
        .then(response => {
          if (response.data.status !== "cancelled"){
            console.log(response.data)
            const data_to_send={
              id: response.data.id,
              status: response.data.status,
              amount: response.data.auto_recurring.transaction_amount,
              lastPaymentDay: "",
              nextPaymentDay: response.data.next_payment_date,
              frequency: 1,
              subscriptionState: {
                state: response.data.status
              }
          }
          res.status(200).send({ message: data_to_send });}
          else{
            return res.status(200).send(undefined);
          }
        })
        .catch(error => {
          console.error(error);
          return error
        })
      }  
      else{
        res.status(200).send({ message: "Subscriptions not found" });
      }
    }
    ).catch(err => {
      res.status(500).send({ message: err.message });
    }
    );
}


exports.modifyMpSubscription = async (req, res) => {
  const axios = require('axios');
  console.log(req.body)
  id = req.body.subscriptionId
  if (req.body.state != null){
    data = {
      "status": req.body.state
    }
  }
  else{
    data = {
      "auto_recurring": {
        "transaction_amount": req.body.amount
      }
    }
  }
  axios.put(`https://api.mercadopago.com/preapproval/${id}`, data, {
    headers: {
      'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response);
      res.status(200).send({ message: response.data });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ message: error.message });
    });
}

exports.getSubscriptionsStatesByMonth = async (req, res) => {
  var subs = []
  items = 0
  date = req.body.year + "-" + req.body.month
  console.log(date)
  MpSubscriptions.findAll({
    limit: req.body.limit,
    offset: req.body.offset
  })
  .then(async (mpSubscription) => {
    if(mpSubscription){
      mpSubscription.forEach(element => {
        axios.get(`https://api.mercadopago.com/preapproval/${element.token}`, {
          headers: { 'Authorization': 'Bearer APP_USR-8339819919751489-070916-e118ee2d8ed3b39f3e31d4956244f4cc-1418606791' }
        })
        .then(response => {
          if(response.data.status == "cancelled"){
            state = "C"
          }
          else if(response.data.status == "authorized"){
            state = "A"
          }
          else{ state = "P"}
          console.log(response.data)
          data = {
            id: response.data.id,
            state: state,
            amount: response.data.auto_recurring.transaction_amount,
            lastPaymentDate: response.data.summarized.last_charged_date,
            nextPaymentDate: response.data.next_payment_date.substring(0,10),
            frequency: 1,
            userId: element.userId,
            subscriptionState: {
              state: state
            }
          }
          if(state == "C" & response.data.last_modified.substring(0,7) != date){
            console.log("invalid")
            subs.push(data)
          }
          else{
            subs.push(data)
          }
          
          items = items + 1
          if (items == mpSubscription.length){
            return res.status(200).send(subs);
          }
        });
      });
    }
    else{
      res.status(200).send({ message: "Subscriptions not found" });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  }
  );
}