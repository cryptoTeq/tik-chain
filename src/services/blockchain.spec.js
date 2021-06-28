const Blockchain = require("./blockchain");

let blockchain = new Blockchain();
const genesisBlockInfo = {
  nonce: "NONCE",
  previousBlockHash: "PREVIOUS_BLOCK_HASH",
  hash: "HASH",
};

beforeEach(() => {
  blockchain = new Blockchain();
});

const createGenesisBlock = () => {
  const { hash, nonce, previousBlockHash } = genesisBlockInfo;
  return blockchain.createNewBlock(nonce, previousBlockHash, hash);
};

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
