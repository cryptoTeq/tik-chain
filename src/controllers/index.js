const Blockchain = require("../services/blockchain");

const blockchain = new Blockchain();

exports.home = (req, res) => {
  res.send({ ok: true });
};

exports.getChain = (req, res) => {
  const { chain, pendingTransactions } = blockchain;
  res.send({ chain, pendingTransactions });
};

exports.postTransaction = (req, res) => {
  const { amount, sender, receiver } = req.body;
  const blockId = blockchain.addNewTransaction(amount, sender, receiver);
  res.send({
    ok: true,
    message: `Pending transaction added to block ${blockId}`,
  });
};
exports.mineBlock = (req, res) => {
  const { pendingTransactions } = blockchain;
  const { hash: previousBlockHash } = blockchain.getLastBlock();
  const nonce = blockchain.proofOfWork({
    previousBlockHash,
    blockTransactions: pendingTransactions,
  });
  const hash = blockchain.hashBlockTransactions({
    previousBlockHash,
    blockTransactions: pendingTransactions,
    nonce,
  });
  const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, hash);
  res.send({ ok: true, message: "New block mined.", newBlock });
};
