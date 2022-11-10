const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "patapila-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

// database
const db = require("./app/models");
const userRoutes = require("./app/routes/user.routes");
const Role = db.role;

db.sequelize.sync();

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/payments.routes")(app);
require("./app/routes/milestones.routes")(app);
require("./app/routes/activities.routes")(app);
require("./app/routes/profilepicture.routes")(app);
require("./app/routes/globalimages.routes")(app);

var subs = ""
var transactions = ""
/*function filterSubs() {
  return axios.get(
    'https://pp-app-backend.herokuapp.com/api/payment/filterSubscriptions',
  );
}

function pendingTransactions() {
  return axios.get(
    'https://pp-app-backend.herokuapp.com/api/payment/getPendingTransactions',
  );
}

function createTransaction(amount,type,userId,subscriptionId) {
  return axios.post(
    'https://pp-app-backend.herokuapp.com/api/payment/createTransaction',{
      amount,
      type,
      userId,
      subscriptionId
    }
  );
}
function changeNextDate(subscriptionId, nextPaymentDate, lastPaymentDate) {
  return axios.post(
    'https://pp-app-backend.herokuapp.com/api/payment/modifySubscription',{
      subscriptionId, 
      nextPaymentDate, 
      lastPaymentDate
    }
  );
}

function modifyTransactionState(transactionId,state) {
  return axios.post(
    'https://pp-app-backend.herokuapp.com/api/payment/modifyTransactionState',{
      transactionId,
      state
    }
  );
}

function countRecurrentTransactions() {
  return axios.post(
    'https://pp-app-backend.herokuapp.com/api/payment/countRecurrentTransactions',
  );
}

function assingLongevityMilestone(userId,milestoneId) {
  return axios.post(
    'https://pp-app-backend.herokuapp.com/api/milestone/assingLongevityMilestone',{
      userId,
      milestoneId
    }
  );
}

filterSubs().then(subs => {
  for( i in subs.data){
    console.log(i)
    var frequency = subs.data[i].frequency
    var paymentDate = subs.data[i].nextPaymentDate
    var now = new Date();
    if( frequency === 1){
      var current = new Date(now.setMonth(now.getMonth() + 1));
    }
    else if ( frequency === 2){
      var current = new Date(now.setMonth(now.getMonth() + 3));
    }
    else if (frequency === 3){
      var current = new Date(now.setMonth(now.getMonth() + 6));
    }
    else{
      var current = new Date(now.setMonth(now.getMonth() + 12));
    }
    var nextPaymentDate = current.toISOString().split('T')[0]
    changeNextDate(subs.data[i].id,nextPaymentDate,paymentDate).then(res => console.log(res.status))
    createTransaction(subs.data[i].amount,"recurrent",subs.data[i].userId,subs.data[i].id).then(res => console.log(res.status))
  }
});

pendingTransactions().then(transactions =>{
  var value = 0
  for(i in transactions.data){
    if(value === 0){
      modifyTransactionState(transactions.data[i].transactionId,"A").then(res => console.log(res.status))
      value = 1
    }
    else{
      modifyTransactionState(transactions.data[i].transactionId,"R").then(res => console.log(res.status))
      value = 0
    }
  }
})
countRecurrentTransactions().then(res => {
  console.log(res.data)
  for(i in res.data){
    if(res.data[i].count == 6){
      assingLongevityMilestone(res.data[i].userId,3).then(res => console.log(res.status))
    }
    else if(res.data[i].count == 12){
      assingLongevityMilestone(res.data[i].userId,4).then(res => console.log(res.status))
    }
    else{
      console.log("No se cumple")
      console.log(res.data[i].count)
    }
  }
})*/

// set port, listen for requests
let port=process.env.PORT||8080;
app.listen(port, () => {
    console.log(`App running on port ${port} `);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "admin",
  });
}

//token recieve
app.get('/verify/:token', (req, res)=>{
	const {token} = req.params;

	// Verifing the JWT token
	jwt.verify(token, 'ourSecretKey', function(err, decoded) {
		if (err) {
			console.log(err);
			res.send("Email verification failed,possibly the link is invalid or expired");
		}
		else {
			res.redirect(`http://localhost:3000/resetPassword/${1}/${token}`); 
		}
	});
});