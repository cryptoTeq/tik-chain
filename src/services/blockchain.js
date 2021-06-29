const sha256 = require("crypto-js/sha256");

module.exports = class Blockchain {
  static PROOF_OF_WORK_PREFIX = "0000";
  static HASH_LENGTH = 64;
  static GENESIS_BLOCK_INFO = Object.freeze({
    nonce: 622,
    previousBlockHash: 0,
    hash: 0,
  });

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    // Genesis Block
    const { hash, previousBlockHash, nonce } = Blockchain.GENESIS_BLOCK_INFO;
    this.createNewBlock(nonce, previousBlockHash, hash);
  }

  getGenesisBlock() {
    return this.chain[0];
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
      const hash = sha256(
        `${previousBlockHash}${nonce.toString()}${JSON.stringify(
          blockTransactions
        )}`
      ).toString();
      if (hash.length !== Blockchain.HASH_LENGTH)
        throw new Error("Hash Not Valid");
      return hash;
    } catch (e) {
      return null;
    }
  }

  proofOfWork({ previousBlockHash, blockTransactions }) {
    let hash, result;
    let nonce = 0;
    do {
      hash = this.hashBlockTransactions({
        previousBlockHash,
        blockTransactions,
        nonce,
      });
      if (hash.startsWith(Blockchain.PROOF_OF_WORK_PREFIX)) result = nonce;
      nonce++;
    } while (!result);
    return result;
  }
};
