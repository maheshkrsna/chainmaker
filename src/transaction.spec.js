import Transaction from './transaction';
import elliptic from 'elliptic';
import sinon from 'sinon';

describe('Transaction.js', function() {
    let EllipticCryptography = elliptic.ec;
    let ec = new EllipticCryptography('secp256k1');
    let key = ec.genKeyPair();
    const PUBLIC_KEY = key.getPublic('hex');
    const FROM_ADDRESS = key.getPublic('hex');
    const DATA = {type: 'data',
        value: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'};

    beforeEach(function() {
        Date.now = function() {
            const NOW_IN_MILLISECONDS = 1556475677127;
            return NOW_IN_MILLISECONDS;
        };
    });

    describe('Create Transaction', function() {
        it('Should create a new Transaction Object', function() {
            let transactionObject = Transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
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

    describe('Verify Transaction', function() {
        it('Should return true if transaction is valid', function() {
            let transactionObject = Transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            let isValidTransaction = Transaction.verifyTransaction(
                transactionObject, PUBLIC_KEY);
            isValidTransaction.should.be.true;
        });

        it('Should return false if transaction is invalid', function() {
            let transactionObject = Transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            transactionObject.data = JSON.stringify(
                {type: 'data', value: 'Man in the middle attacks here'}
            );
            let isValidTransaction = Transaction.verifyTransaction(
                transactionObject, PUBLIC_KEY);
            isValidTransaction.should.be.false;
        });
    });

    describe('Add Transaction to pool', function() {
        beforeEach(function() {
            Transaction._transactionPool = [];
        });
        it('Should verify and add valid transaction to the pool', function() {
            let transactionObject = Transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            Transaction.verifyTransaction = sinon.fake.returns(true);

            Transaction.addTransactionToThePool(transactionObject);

            sinon.assert.calledWithExactly(Transaction.verifyTransaction,
                transactionObject, transactionObject.fromAddress);
            Transaction._transactionPool[0].should.equal(transactionObject);
        });

        it('Should not add invalid transaction to the pool', function() {
            let transactionObject = Transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            Transaction.verifyTransaction = sinon.fake.returns(false);

            try {
                Transaction.addTransactionToThePool(transactionObject);
            } catch(e) {
                // How do u add test case for error checking in mocha?
            }

            sinon.assert.calledWithExactly(Transaction.verifyTransaction,
                transactionObject, transactionObject.fromAddress);
            Transaction._transactionPool.length.should.equal(0);
        });
    });
});
