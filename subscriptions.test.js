const userRoutes = require("./app/routes/user.routes")
const paymetsRoutes = require("./app/routes/payments.routes")
const express = require("express");
const cors = require("cors");
const axios = require('axios');
const { request } = require("express");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
//se corren los tests con el comando npm test
//para crear otra suite solo se debe crear un archivo con el nombre-de-la-suite.test.js
app.use(express.urlencoded({ extended: true }));
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/payments.routes")(app);

test('shoul fail to create a MP subscription withou a token', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/process_payment',{
      data:{
        userId: 3,
        frequency: 1,
        amount: 1000,
        nextPaymentDate: "2021-01-01",
      }
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe('Token is required')
    })
  })

test('should fail to create a MP subscription with no card data', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/process_payment',{
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe('Card data is required')
    })
  })

test('should fail to create a MP subscription with no user data', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/process_payment',{
      data:{
        frequency: 1,
        amount: 1000,
        nextPaymentDate: "2021-01-01",
        token: "token"
      }
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe('User id is required')
    })
})

test('should fail to create a MP subscription with no email', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/process_payment',{
      data:{
        frequency: 1,
        amount: 1000,
        nextPaymentDate: "2021-01-01",
        token: "token",
        payer: {
          name: "name",
          surname: "surname",
        }
      },
      user_id: 3})
      .catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe('Email is required')
    })
})

test('should fail to create a MP subscription with invalid token', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/process_payment',{
      data:{
        frequency: 1,
        amount: 1000,
        nextPaymentDate: "2021-01-01",
        token: "token",
        payer: {
          email: "user@testuser.com"
        }
      },
      user_id: 3})
      .catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe('Request failed with status code 404')
    })
})

test('shold return empty when no subscription is found', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/find_user_mp_subscription',{
      userId: 300
      }).catch(e =>{
        expect(e.response.status).toEqual(200)
        expect(e.response.data.message).toBe(undefined)
    })
})

test('should fail to fetch a MP subscription with invalid user id', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/find_user_mp_subscription',{
      }).catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe("User id is required")
    })
})

test('should fail to modidy a MP subscription without a subscription id', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/modify_mp_subscription',{
      }).catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe("Subscription id is required")
    })
})

test('should fail to modidy a MP subscription without a state', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/modify_mp_subscription',{
      subscriptionId: 1
      }).catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe("State is required")
    })
})

test('should fail to modify a MP subscription with invalid state', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/modify_mp_subscription',{
      subscriptionId: 1,
      state: "invalid",
      amount: 1000
      }).catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe("Invalid state")
    })
})

test('fail to modify a MP subscription with invalid amount', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/modify_mp_subscription',{
      subscriptionId: 1,
      state: "active",
      amount: -1
      }).catch(e =>{
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe("Invalid Amount")
    })
})

test('Should fail to return an income for an invalid month', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getMonthIncome',{
      month: 13
      }).catch(e =>{
        expect(e.response.status).toEqual(404)
        expect(e.response.data.message).toBe("Month Not found.")
    })
})

test('Should fail to return an income for an undefined month', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getMonthIncome',{}
      ).catch(e =>{
        expect(e.response.status).toEqual(404)
        expect(e.response.data.message).toBe("Month Not found.")
    })
})

test('Should fail to return an income for an invalid month type', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getMonthIncome',{
      month: "invalid"
      }).catch(e =>{
        expect(e.response.status).toEqual(404)
        expect(e.response.data.message).toBe("Month Must be an Integer")
    })
})

/*test('should return all subscriptions', async () => { 
    const res = await axios.post('http://localhost:8080/api/payment/getSubscriptions',{
      limit: 10,
      offset: 0
    }).catch(e =>{
      expect(e.response.status).toEqual(404)
      expect(e.response.data.message).toBe('"Subscriptions not found"')
    })
    expect(res.status).toEqual(200)
})
test('should modify subscription state', async () => { 
    const res = await axios.post('http://localhost:8080/api/payment/modifySubscriptionState',{
      subscriptionId: 2,
      state: "A"
    })
    expect(res.status).toEqual(200)
    expect(res.data.message).toBe('Subscription state modified successfully!')
})

test('should get subscription', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getSubscription',{
        userId: 2
    })
    expect(res.status).toEqual(200)
})

test('should fail to create subscription with invalid userId', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: "300",
      frequency: 4,
      amount: 1000,
      nextPaymentDate: "2021-01-01",
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe('userid debe ser un entero.')
    })
  })
test('should fail to create subscription with invalid frequency type', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: 3,
      frequency: "1",
      amount: 1000,
      nextPaymentDate: "2021-01-01",
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe(' La frecuencia es inválida.')
    })
  })
  
  test('should fail to create subscription with invalid amount', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: 3,
      frequency: 1,
      amount: -1,
      nextPaymentDate: "2021-01-01",
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe(' El monto es inválido.')
    })
  })
  
  test('should fail to create subscription with invalid amount type', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: 3,
      frequency: 1,
      amount: "1000",
      nextPaymentDate: "2021-01-01",
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe(' El monto es inválido.')
    })
  })
  
  test('should fail to create subscription with invalid date type', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: 3,
      frequency: 1,
      amount: 100,
      nextPaymentDate: 4,
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe(' La fecha de pago es inválida.')
    })
  })

  test('should fail to create subscription with invalid frequency', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: 3,
      frequency: 5,
      amount: 1000,
      nextPaymentDate: "2021-01-01",
    }).catch(e =>{
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe(' La frecuencia es inválida.')
    })
  })

test('should fail to create subscription with invalid data', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createSubscription',{
      userId: "3",
      frequency: -1,
      amount: 0,
      nextPaymentDate: 4,
    }).catch(e =>{//en caso de esperar un error lo capturamos con un catch
      expect(e.response.status).toEqual(400)
      expect(e.response.data.message).toBe('userid debe ser un entero. La frecuencia es inválida. La fecha de pago es inválida.')
    })
  })*/
  