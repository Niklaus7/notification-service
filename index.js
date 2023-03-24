const express = require("express");
const cors = require("cors");
const { getDataByAppId, notifyAllClients, sendEvent } = require("./notifier");

const app = express();
const PORT = process.env.PORT || 3002;

var corsOptions = {
  origin: "https://localhost:44395",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("I am on!");
});

app.get("/notifications/:appId/subscribe", (req, res) => {
  const appId = req.params.appId;

  if (!appId) {
    res.sendStatus(400);
  }

  if (req.headers.accept === "text/event-stream") {
    sendEvent(req, res, appId);
  } else {
    res.send(getDataByAppId(appId));
  }
});

app.post("/notifications/:appId/push", (req, res) => {
  const appId = req.params.appId;

  if (!appId) {
    res.sendStatus(400);
  }

  const notification = req.body["notification"];
  res.send(notification);
  return notifyAllClients(notification, appId);
});

app.listen(PORT, () => {
  console.log(`Server started on port number ${PORT}`);
});
