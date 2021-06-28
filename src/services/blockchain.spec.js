const Blockchain = require("./blockchain");

let blockchain = new Blockchain();
const genesisBlockInfo = {
  nonce: "NONCE",
  previousBlockHash: "PREVIOUS_BLOCK_HASH",
  hash: "HASH",
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
    expect(previousBlockHash).toEqual(PREVIOUS_BLOCK_HASH);
    expect(hash).toEqual(HASH);

    const { chain, pendingTransactions } = blockchain;
    expect(pendingTransactions.length).toEqual(0);
    expect(chain.length).toEqual(1);
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

      expect(lid).toEqual(id);
      expect(ltrans.length).toEqual(transactions.length);
      expect(lpbh).toEqual(previousBlockHash);
      expect(ln).toEqual(nonce);
      expect(lh).toEqual(hash);
    });
  });
});
