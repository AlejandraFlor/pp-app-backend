const express = require("express");
const cors = require("cors");
const axios = require('axios');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
//se corren los tests con el comando npm test
//para crear otra suite solo se debe crear un archivo con el nombre-de-la-suite.test.js
app.use(express.urlencoded({ extended: true }));
require("./app/routes/user.routes")(app);
require("./app/routes/payments.routes")(app);

test('should not create a preference', async () => {
    const res = await axios.post('http://localhost:8080/api/paymentmp/createAndPayTransaction',{}).catch(e => {
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toBe('Empty request')
        })
        });
test('should fail to find preference', async () => {
    const res = await axios.post('http://localhost:8080/api/paymentmp/getPreference', {id:"1"}).catch(e => {
        expect(e.response.data.status).toBe(404)
        expect(e.response.data.message).toBe('The preference with identifier 1 was not found')
        })
        });

test('should find preference', async () => {
    const res = await axios.post('http://localhost:8080/api/paymentmp/getPreference', {id:"1254193430-fd67cfc0-adca-4ed3-9258-f761d7861b8f"}).catch(e => {
        expect(e.response.status).toEqual(500)
        expect(e.response.data.message).toBe('The preference with identifier 1 was not found')
        })
        expect(res.status).toEqual(200)
        expect(res.data).toBeInstanceOf(Object)
        expect(res.data.response.items[0]).toHaveProperty('unit_price')
});

test('should fail to create a preference with invalid price', async () => {
    const res = await axios.post('http://localhost:8080/api/paymentmp/createAndPayTransaction',{
    amount: 0,
    type: "one",
    userId:1,
    name:"Paula",
    lastName:"Aletti"
  }).catch(e => {
    expect(e.response.status).toEqual(400)
    expect(e.response.data.message).toBe('unit_price invalid')
    })});

test('should create and pay a transaction', async () => {
    const res = await axios.post('http://localhost:8080/api/paymentmp/createAndPayTransaction',{
    amount: 100,
    type: "onlyTime",
    userId:5,
    name:"Mateo",
    lastName:"Strauch"
    }).catch(e => {
        expect(e.response.data.status).toEqual(404)
        expect(e.response.data.message).toBe('unit_price invalid')
        })
        expect(res.status).toEqual(200)
        expect(res.data).toBeInstanceOf(Object)
        expect(res.data).toHaveProperty('preferenceId')
    });