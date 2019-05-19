import Transaction from './transaction';
import elliptic from 'elliptic';
import sinon from 'sinon';

describe('Transaction.js', () => {
    let EllipticCryptography = elliptic.ec;
    let ec = new EllipticCryptography('secp256k1');
    let key = ec.genKeyPair();
    const PRIVATE_KEY = key.getPrivate('hex');
    const PUBLIC_KEY = key.getPublic('hex');
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

    describe('Create Transaction', () => {
        it('Should create a new Transaction Object', () => {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, PRIVATE_KEY);
            transactionObject.should.have.property('fromAddress').to.
                equal(FROM_ADDRESS);
            transactionObject.should.have.property('toAddress').to.
                equal('0123456789ABCDEF');
            transactionObject.should.have.property('data').to.
                equal(JSON.stringify(DATA));
            transactionObject.should.have.property('timeStamp').to.
                equal(Date.now());
            transactionObject.should.have.property('signature');
        });
    });

    describe('Verify Transaction', () => {
        it('Should return true if transaction is valid', () => {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, PRIVATE_KEY);
            let isValidTransaction = transaction.verifyTransaction(
                transactionObject, PUBLIC_KEY);
            isValidTransaction.should.be.true;
        });

        it('Should return false if transaction is invalid', () =>  {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, PRIVATE_KEY);
            transactionObject.data = JSON.stringify(
                {type: 'data', value: 'Man in the middle attacks here'}
            );
            let isValidTransaction = transaction.verifyTransaction(
                transactionObject, PUBLIC_KEY);
            isValidTransaction.should.be.false;
        });
    });

    describe('Add Transaction to pool', () => {
        beforeEach(() => {
            transaction._transactionPool = [];
        });
        it('Should verify and add valid transaction to the pool', () => {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, PRIVATE_KEY);
            transaction.verifyTransaction = sinon.fake.returns(true);

            transaction.addTransactionToThePool(transactionObject);

            sinon.assert.calledWithExactly(transaction.verifyTransaction,
                transactionObject, transactionObject.fromAddress);
            transaction.transactionPool[0].should.equal(transactionObject);
        });

        it('Should not add invalid transaction to the pool', () => {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, PRIVATE_KEY);
            transaction.verifyTransaction = sinon.fake.returns(false);

            try {
                transaction.addTransactionToThePool(transactionObject);
            } catch(e) {
                // How do u add test case for error checking in mocha?
            }

            sinon.assert.calledWithExactly(transaction.verifyTransaction,
                transactionObject, transactionObject.fromAddress);
            transaction._transactionPool.length.should.equal(0);
        });
    });
});
