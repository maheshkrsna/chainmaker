import Blockchain from './blockchain';
import Block from './block';
import elliptic from 'elliptic';
import Transaction from './transaction';

describe('Blockchain.js', () => {
    let blockChain = new Blockchain();
    let EllipticCryptography = elliptic.ec;
    let ec = new EllipticCryptography('secp256k1');
    let key = ec.genKeyPair();
    // const PUBLIC_KEY = key.getPublic('hex');
    const FROM_ADDRESS = key.getPublic('hex');
    const DATA = {type: 'data',
        value: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'};
    let transaction = new Transaction();

    beforeEach(() => {
        Date.now = () => {
            const NOW_IN_MILLISECONDS = 1556475677127;
            return NOW_IN_MILLISECONDS;
        };
    });

    describe('on init', () => {
        it('should have one genesis block', () => {
            blockChain.getBlockchain().length.should.equal(1);
        });
    });

    describe('on Adding a block', () => {
        it('should add a block to the blockChain', () => {
            const transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            const previousBlockHash = blockChain.getBlockchain()[0].hash;
            let block = Block.mineBlock(
                previousBlockHash, JSON.stringify([transactionObject]), 1
            );
            blockChain.addBlock(block);
            blockChain.getBlockchain().length.should.equal(2);
        });
    });

    describe('on existing blockChain', () => {
        let key1 = ec.genKeyPair();
        const FROM_ADDRESS_1 = key1.getPublic('hex');
        let key2 = ec.genKeyPair();
        const FROM_ADDRESS_2 = key2.getPublic('hex');
        let transaction1, transaction2, transaction3, transaction4, transaction5;
        beforeEach(() => {
            blockChain = new Blockchain();
            const DATA_1 = {type: 'currency',
                value: 10};
            const DATA_2 = {type: 'currency',
                value: 10};
            const DATA_3 = {type: 'currency',
                value: 5};
            const DATA_4 = {type: 'currency',
                value: 10};
            const DATA_5 = {type: 'currency',
                value: 10};
            let transactionList1 = [];
            let transactionList2 = [];

            transaction1 = transaction.createTransaction(FROM_ADDRESS,
                FROM_ADDRESS_1, DATA_1, key);
            transaction2 = transaction.createTransaction(FROM_ADDRESS,
                FROM_ADDRESS_2, DATA_2, key);
            transaction3 = transaction.createTransaction(FROM_ADDRESS_1,
                FROM_ADDRESS_2, DATA_3, key1);
            transaction4 = transaction.createTransaction(FROM_ADDRESS_2,
                FROM_ADDRESS_1, DATA_4, key2);
            transaction5 = transaction.createTransaction(FROM_ADDRESS_1,
                '0123456789ABCDEF', DATA_5, key1);

            transactionList1.push(JSON.stringify(transaction1));
            transactionList1.push(JSON.stringify(transaction2));

            transactionList2.push(JSON.stringify(transaction3));
            transactionList2.push(JSON.stringify(transaction4));
            transactionList2.push(JSON.stringify(transaction5));

            let block1 = Block.mineBlock(
                blockChain.getLastBlockHash(), JSON.stringify(transactionList1), 1
            );
            blockChain.addBlock(block1);
            let block2 = Block.mineBlock(
                blockChain.getLastBlockHash(), JSON.stringify(transactionList2), 1
            );
            blockChain.addBlock(block2);
        });

        it('should get balance of transactions when queried for', () => {
            const balanceOfAddress1 = blockChain.getBalance(FROM_ADDRESS_1);
            const remainingBalance = 5;
            balanceOfAddress1.should.equal(remainingBalance);
        });

        it('should get list of transactions from a specific address', () => {
            const fromAddressTransactionList = [transaction3, transaction5];
            const fromTransactionList = blockChain.getTransaction(FROM_ADDRESS_1, '*');
            JSON.stringify(fromTransactionList).should.equal(
                JSON.stringify(fromAddressTransactionList)
            );
        });

        it('should get list of transactions to a specific address', () => {
            const toAddressTransactionList = [transaction2, transaction3];
            const toTransactionList = blockChain.getTransaction('*', FROM_ADDRESS_2);
            JSON.stringify(toTransactionList).should.equal(
                JSON.stringify(toAddressTransactionList)
            );
        });

        it('should get list of transactions from and to a specific address', () => {
            const specificTransactionList = [transaction4];
            const specificTransaction =
                blockChain.getTransaction(FROM_ADDRESS_2, FROM_ADDRESS_1);
            JSON.stringify(specificTransaction).should.equal(
                JSON.stringify(specificTransactionList)
            );
        });

        it('should return a clone of blockChain when queried for', () => {
            const blockChainClone = JSON.stringify(blockChain.getBlockchain());
            JSON.stringify(blockChain.getBlockchain()).should.equal(blockChainClone);
        });

        it('should get last block\'s hash when queried for', () => {
            const blockChainClone = blockChain.getBlockchain();
            const lastBlockHash = blockChainClone[blockChainClone.length - 1].hash;
            blockChain.getLastBlockHash().should.equal(lastBlockHash);
        });

        it('should get the block from the block chain when queried for', () => {
            const thirdBlock = blockChain.getBlockchain()[2];
            const thirdBlockHash = thirdBlock.hash;
            JSON.stringify(blockChain.getBlock(thirdBlockHash)).should.equal(
                JSON.stringify(thirdBlock)
            );
        });
    });
});
