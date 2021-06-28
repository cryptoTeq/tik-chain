module.exports = class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
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
};
