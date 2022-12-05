const notificationRoute = require("./app/routes/notification.routes")
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
require("./app/routes/notification.routes")(app);

test('should return all notifications', async () => {
    const res = await axios.post('http://localhost:8080/api/notification/getNotifications').catch(e =>{
        expect(e.response.status).toEqual(404)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Array)
  })

test('should create a notification', async () => {
    const res = await axios.post('http://localhost:8080/api/notification/createNotification', {
        title: "test",
        description: "test"
    }).catch(e =>{
        expect(e.response.status).toEqual(500)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Object)
      expect(res.data.message).toBe('Notification created successfully!')
  })

test('should read a notification', async () => {
    const res = await axios.post('http://localhost:8080/api/notification/readNotifications', {
        id: 13
    }).catch(e =>{
        expect(e.response.status).toEqual(500)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Object)
      expect(res.data.message).toBe("Notification read successfully!")
  })

test('should delete a notification', async () => {
    const res = await axios.post('http://localhost:8080/api/notification/deleteNotification', {
        id: 16
    }).catch(e =>{
        expect(e.response.status).toEqual(500)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Object)
      expect(res.data.message).toBe("Notification deleted successfully!")
  })

test('can not delete a notification', async () => {
    const res = await axios.post('http://localhost:8080/api/notification/deleteNotification', {
        id: 1
    }).catch(e =>{
        expect(e.response.status).toEqual(500)
      })
      expect(res.status).toEqual(200)
      expect(res.data).toBeInstanceOf(Object)
  })