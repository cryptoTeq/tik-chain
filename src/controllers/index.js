const Blockchain = require("../services/blockchain.service");
const nodeService = require("../services/node.service");

const blockchain = new Blockchain();

exports.home = (req, res) => {
  res.send({ ok: true });
};

exports.getChain = (req, res) => {
  const {
    chain,
    pendingTransactions,
    currentNodeUrl: nodeUrl,
    nodeUrls: nodes,
  } = blockchain;
  res.send({ nodeUrl, chain, pendingTransactions, nodes });
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

exports.registerBroadcastNode = async (req, res) => {
  const { nodeUrl } = req.body;
  const addResult = blockchain.addNode(nodeUrl);
  if (!addResult)
    return res.json({ ok: false, message: "Node already exists." });
  try {
    await nodeService.broadcastNode(nodeUrl, blockchain.nodeUrls);
    await nodeService.registerBulk(nodeUrl, [
      ...blockchain.nodeUrls,
      blockchain.currentNodeUrl,
    ]);
    res.json({
      ok: true,
      message: `Node ${nodeUrl} has been added to network.`,
    });
  } catch {
    res.json({ ok: false, message: "Node not available." });
  }
};

exports.registerNode = (req, res) => {
  res.send({ node: req.body.nodeUrl });
};

exports.registerBulk = ({ body: { nodeUrls } }, res) => {
  nodeUrls.forEach((url) => blockchain.addNode(url));
  res.json({ ok: true, message: `${nodeUrls.length} Nodes registered` });
};
