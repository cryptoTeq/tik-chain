const express = require("express");
const { mineBlock, postTransaction, getChain, home } = require("./controllers");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env["port"] || 3000;

app.get("/", home);
app.get("/chain", getChain);
app.post("/transactions", postTransaction);
app.post("/mine", mineBlock);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
