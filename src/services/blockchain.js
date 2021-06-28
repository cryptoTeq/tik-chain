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
};
