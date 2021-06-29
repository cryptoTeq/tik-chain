const Blockchain = require("./blockchain");

jest.mock(
  "crypto-js/SHA256",
  () => () => "000010c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111"
);

let blockchain = new Blockchain();
const genesisBlockInfo = {
  nonce: "NONCE",
  previousBlockHash: "PREVIOUS_BLOCK_HASH",
  hash: "HASH",
};
const blockData = {
  previouseBlockHash: "RANDOM_HASH_DATA",
  blockTransactions: [
    { amount: 1234.0001, sender: "SENDER1", receiver: "RECEIVER1" },
    { amount: 5678.0002, sender: "SENDER2", receiver: "RECEIVER2" },
  ],
};

const createGenesisBlock = () => {
  const { hash, nonce, previousBlockHash } = genesisBlockInfo;
  return blockchain.createNewBlock(nonce, previousBlockHash, hash);
};

describe("Blockchain", () => {
  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test("creates the genesis block", () => {
    const {
      hash: HASH,
      previousBlockHash: PREVIOUS_BLOCK_HASH,
      nonce: NONCE,
    } = genesisBlockInfo;
    const { id, transactions, previousBlockHash, nonce, hash } =
      createGenesisBlock();

    expect(nonce).toBe(NONCE);
    expect(id).toBe(1);
    expect(transactions).toEqual(expect.arrayContaining([]));
    expect(previousBlockHash).toBe(PREVIOUS_BLOCK_HASH);
    expect(hash).toBe(HASH);

    const { chain, pendingTransactions } = blockchain;
    expect(pendingTransactions.length).toBe(0);
    expect(chain.length).toBe(1);
  });

  test("calculates proof of work (nonce)", () => {
    const nonce = blockchain.proofOfWork({ ...blockData });
    const blockHash = blockchain.hashBlockTransactions({ ...blockData, nonce });
    expect(blockHash.startsWith("0000")).toBe(true);
  });

  describe("hashing", () => {
    const hashingParams = {
      nonce: 123456789,
      ...blockData,
    };
    test("generates block hash data", () => {
      const hash = blockchain.hashBlockTransactions(hashingParams);
      expect(hash).toBeTruthy();
      expect(hash.length).toEqual(64);
    });

    test("returns null on Error", () => {
      const params = { ...hashingParams, nonce: undefined };
      const hash = blockchain.hashBlockTransactions(params);
      expect(hash).toBe(null);
    });
  });

  describe("getLastBlock", () => {
    test("returns null on empty blockchain", () => {
      expect(blockchain.getLastBlock()).toEqual(null);
      expect(blockchain.chain.length).toEqual(0);
    });

    test("returns last block on non-empty blockchain", () => {
      const { id, transactions, previousBlockHash, nonce, hash } =
        createGenesisBlock();
      const {
        id: lid,
        transactions: ltrans,
        previousBlockHash: lpbh,
        nonce: ln,
        hash: lh,
      } = blockchain.getLastBlock();

      expect(lid).toBe(id);
      expect(ltrans.length).toBe(transactions.length);
      expect(lpbh).toBe(previousBlockHash);
      expect(ln).toBe(nonce);
      expect(lh).toBe(hash);
    });
  });

  describe("New transaction", () => {
    let newTransaction, holderBlockId;
    const { amount, sender, receiver } = {
      sender: "SENDER",
      receiver: "RECEIVER",
      amount: "AMOUNT",
    };

    beforeEach(() => {
      createGenesisBlock();
      holderBlockId = blockchain.addNewTransaction(amount, sender, receiver);
      newTransaction = blockchain.pendingTransactions[0];
    });

    test("adds a new transaction to the pending transactions", () => {
      const {
        amount: txAmount,
        sender: txSender,
        receiver: txReceiver,
      } = newTransaction;
      expect(blockchain.pendingTransactions.length).toBe(1);
      expect(txAmount).toBe(amount);
      expect(txReceiver).toBe(receiver);
      expect(txSender).toBe(sender);
    });

    test("returns potential holder block id", () => {
      expect(holderBlockId).toBeTruthy();
    });
  });
});
