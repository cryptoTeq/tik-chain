const { port, protocol, serverUrl } = require("../config");
const axios = require("axios").default;

exports.getCurrentNodeUrl = () => `${protocol}://${serverUrl}:${port}`;

exports.broadcastNode = (nodeUrl, nodeUrls) => {
  return Promise.all(
    nodeUrls.map((u) => axios.post(`${u}/register-node`, { nodeUrl }))
  );
};

exports.registerBulk = (nodeUrl, nodeUrls) =>
  axios.post(`${nodeUrl}/register-nodes-bulk`, { nodeUrls });
