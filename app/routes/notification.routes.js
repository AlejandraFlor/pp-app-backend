const controller = require("../controllers/notification.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/notification/createNotification", controller.createNotification);
  app.post("/api/notification/getNotifications", controller.getNotifications);
  app.post("/api/notification/deleteNotification", controller.deleteNotification)
  app.post("/api/notification/readNotifications", controller.readNotifications);

};