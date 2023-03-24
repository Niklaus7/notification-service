let subscriptionClients = [];
let dataStore = {};

const writeEvent = (res, clientId, data) => {
  res.write(`id: ${clientId}\n`);
  res.write(`data: ${data}\n\n`);
};

const getDataByAppId = (appId) => {
  return dataStore[appId];
};

const sendEvent = (req, res, appId) => {
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const clientId = new Date().toDateString();
  const data = getDataByAppId(appId);

  writeEvent(res, clientId, JSON.stringify(data));
  const client = { res, clientId, appId };
  subscriptionClients.push(client);

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    subscriptionClients = subscriptionClients.filter(
      (client) => client.clientId !== clientId
    );
  });
};

const notifyAllClients = (data, appId) => {
  const clients = subscriptionClients.filter(
    (client) => client.appId === appId
  );
  console.log(data);
  dataStore[appId] = data;
  clients.forEach((client) => {
    writeEvent(client.res, client.clientId, JSON.stringify(data));
  });
};

module.exports = {
  getDataByAppId,
  notifyAllClients,
  sendEvent,
};
