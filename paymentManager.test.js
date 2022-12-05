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

require("./app/routes/payments.routes")(app);

test('should create payments for subscriptions', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/createPaymentSubs', {
      "amount": 980,
      "configuredPaymentDate": "2021-05-01",
      "paymentDate": "2021-05-01",
      "userId": 16,
      "emmited": "NE",
    }).catch(e =>{
        expect(e.response.status).toEqual(404)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Object)
      expect(res.data.message).toBe("Payment  for Subscriotion created successfully!")
  })

test('should get payments generated for subscriptions', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getPaymentSubs').catch(e =>{
        expect(e.response.status).toEqual(404)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Array)
  })

  test('should get payments generated for subscriptions that have been emmited', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getPaymentSubsE').catch(e =>{
        expect(e.response.status).toEqual(404)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Array)
  })

  test('should get payments generated for subscriptions that have not been emmited', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/getPaymentSubsNE').catch(e =>{
        expect(e.response.status).toEqual(404)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Array)
  })

  test('should delete payment generated for subscription', async () => {
    const res = await axios.post('http://localhost:8080/api/payment/deletePaymentSubs', {
      "id": 1
    }).catch(e =>{
        expect(e.response.status).toEqual(500)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Object)
      expect(res.data.message).toBe("Payment deleted!")
  })

test("should update payment generated for subscription", async () => {
  const res = await axios.post('http://localhost:8080/api/payment/modifyPaymentSubs', {
    "id": 4,
    "amount": 650,
    "paymentDate": "2021-05-01",
  }).catch(e =>{
      expect(e.response.status).toEqual(500)
    })
    expect(res.status).toEqual(200)
    expect(res.data).toBeInstanceOf(Object)
    expect(res.data.message).toBe("Payment modify!")
})

test("should emmit payment generated for subscription", async () => {
  const res = await axios.post('http://localhost:8080/api/payment/emmitPaymentSubs', {
    "id": 4,
  }).catch(e =>{
      expect(e.response.status).toEqual(500)
    })
    expect(res.status).toEqual(200)
    expect(res.data).toBeInstanceOf(Object)
    expect(res.data.message).toBe("Payment emmited!")
})