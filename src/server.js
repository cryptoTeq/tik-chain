const express = require("express");
const { port } = require("./config");
const {
  mineBlock,
  postTransaction,
  getChain,
  home,
  registerBroadcastNode,
  registerNode,
  registerBulk,
} = require("./controllers");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", home);
app.get("/chain", getChain);
app.post("/transactions", postTransaction);
app.post("/mine", mineBlock);
app.post("/register-broadcast-node", registerBroadcastNode);
app.post("/register-node", registerNode);
app.post("/register-nodes-bulk", registerBulk);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
