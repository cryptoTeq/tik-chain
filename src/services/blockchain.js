const sha256 = require("crypto-js/sha256");

module.exports = class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    //addGenesisBlock() // TODO:  add this here
  }

  createNewBlock(nonce, prevBlockHash, hash) {
    const newBlock = {
      id: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      previousBlockHash: prevBlockHash,
      nonce,
      hash,
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
  }

  getLastBlock() {
    if (this.chain.length === 0) return null;
    return this.chain[this.chain.length - 1];
  }

  addNewTransaction(amount, sender, receiver) {
    const tx = {
      amount,
      sender,
      receiver,
    };
    this.pendingTransactions.push(tx);
    const holderBlockId = this.getLastBlock()["id"] + 1;
    return holderBlockId;
  }

  hashBlockTransactions({ previousBlockHash, blockTransactions, nonce }) {
    try {
      return sha256(
        `${previousBlockHash}${nonce.toString()}${JSON.stringify(
          blockTransactions
        )}`
      ).toString();
    } catch (e) {
      return null;
    }
  }

  proofOfWork({ previousBlockHash, blockTransactions }) {
    let hash, result;
    let nonce = 0;
    const validHash = "0000";
    do {
      hash = this.hashBlockTransactions({
        previousBlockHash,
        blockTransactions,
        nonce,
      });
      if (hash.startsWith(validHash)) result = nonce;
      nonce++;
    } while (!result);
    return result;
  }
};
