import Transaction from './transaction';
import elliptic from 'elliptic';

describe('Transaction.js', function() {
    let transaction = new Transaction();
    let EllipticCryptography = elliptic.ec;
    let ec = new EllipticCryptography('secp256k1');
    let key = ec.genKeyPair();
    const PUBLIC_KEY = key.getPublic('hex');
    const FROM_ADDRESS = key.getPublic().getX().toString('hex');
    const DATA = `The Times 03/Jan/2009
                Chancellor on brink of second bailout for banks`;

    beforeEach(function() {
        Date.now = function() {
            const NOW_IN_MILLISECONDS = 1556475677127;
            return NOW_IN_MILLISECONDS;
        };
    });

    describe('Create Transaction', function() {
        it('Should create a new Transaction Object', function() {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            transactionObject.should.have.property('fromAddress').to.
                equal(FROM_ADDRESS);
            transactionObject.should.have.property('toAddress').to.
                equal('0123456789ABCDEF');
            transactionObject.should.have.property('data').to.
                equal(DATA);
            transactionObject.should.have.property('timeStamp').to.
                equal(Date.now());
            transactionObject.should.have.property('signature');
        });
    });

    describe('Verify Transaction', function() {
        it('Should return true if transaction is valid', function() {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            let isValidTransaction = transaction.verifyTransaction(
                transactionObject, PUBLIC_KEY);
            isValidTransaction.should.be.true;
        });

        it('Should return false if transaction is invalid', function() {
            let transactionObject = transaction.createTransaction(FROM_ADDRESS,
                '0123456789ABCDEF', DATA, key);
            transactionObject.data = 'Man in the middle attacks here';
            let isValidTransaction = transaction.verifyTransaction(
                transactionObject, PUBLIC_KEY);
            isValidTransaction.should.be.false;
        });
    });
});
