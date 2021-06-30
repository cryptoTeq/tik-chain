const Blockchain = require("./blockchain.service");

jest.mock(
  "crypto-js/SHA256",
  () => () => "000010c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111"
);

let blockchain = new Blockchain();
const sampleBlockData = {
  previouseBlockHash: "RANDOM_HASH_DATA",
  blockTransactions: [
    { amount: 1234.0001, sender: "SENDER1", receiver: "RECEIVER1" },
    { amount: 5678.0002, sender: "SENDER2", receiver: "RECEIVER2" },
  ],
};

describe("Blockchain", () => {
  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test("has all properties", () => {
    expect(blockchain.currentNodeUrl).toEqual("http://localhost:3000");
    expect(blockchain.nodeUrls.length).toBe(0);
  });

  test("adds node to network", () => {
    const nodeUrl = "NODEURL";
    expect(blockchain.nodeUrls.length).toBe(0);
    blockchain.addNode(nodeUrl);
    expect(blockchain.nodeUrls.length).toBe(1);
  });

  test("creates the genesis block on initialization", () => {
    const {
      hash: HASH,
      previousBlockHash: PREVIOUS_BLOCK_HASH,
      nonce: NONCE,
    } = Blockchain.GENESIS_BLOCK_INFO;
    const { id, transactions, previousBlockHash, nonce, hash } =
      blockchain.getGenesisBlock();

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
    const nonce = blockchain.proofOfWork({ ...sampleBlockData });
    console.log(`nonce`, nonce);
    const blockHash = blockchain.hashBlockTransactions({
      ...sampleBlockData,
      nonce,
    });
    expect(blockHash.startsWith(Blockchain.PROOF_OF_WORK_PREFIX)).toBe(true);
  });

  describe("hashing", () => {
    const hashingParams = {
      nonce: 123456789,
      ...sampleBlockData,
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

  test("getLastBlock returns last block", () => {
    const { previousBlockHash, nonce, hash } = Blockchain.GENESIS_BLOCK_INFO;
    const {
      previousBlockHash: lpbh,
      nonce: ln,
      hash: lh,
    } = blockchain.getLastBlock();

    expect(lpbh).toBe(previousBlockHash);
    expect(ln).toBe(nonce);
    expect(lh).toBe(hash);
  });

  describe("New transaction", () => {
    let newTransaction, holderBlockId;
    const { amount, sender, receiver } = {
      sender: "SENDER",
      receiver: "RECEIVER",
      amount: "AMOUNT",
    };

    beforeEach(() => {
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
