import elliptic from 'elliptic';
import eventEmitter from './blockchainevents';
import sha256 from 'hash.js/lib/hash/sha/256.js';

/**
 * @class Transaction
 * @description Class to create and verify transactions
 */
class Transaction {

    #ec;
    constructor() {
        this._transactionPool = [];
        this.maxTransactionPoolSize = 10;

        let EllipticCryptography = elliptic.ec;
        this.#ec = new EllipticCryptography('secp256k1');
    }

    /**
     * @method _generateHash
     * @memberof Block
     * @private
     * @description Generates a hash.
     * @returns {string} hash generated using sha256
     */
    _generateHash() {
        if (arguments.length === 0) {
            throw new Error('There is no data to hash');
        }
        let dataToHash = '';
        for (let i = 0; i < arguments.length; i++) {
            dataToHash += arguments[i];
        }
        let hash = sha256()
            .update(dataToHash)
            .digest('hex')
            .toString();

        return hash;
    }

    /**
     * @method _signTransaction
     * @memberof Transaction
     * @private
     * @description Signs a Transaction object.
     * @param {String} fromAddress Wallet address of the sender
     * @param {String} hash Hash of the data to be signed
     * @param {String} privateKey Elliptic Cryptograhic(EC) Private Key string of the sender
     * @returns {string} Digital Signature
     */
    _signTransaction(fromAddress, hash, privateKey) {
        let key = this.#ec.keyFromPrivate(privateKey, 'hex');
        // * Elliptic cryptography offers us a public key in form of
        // * `y^2 = ax^3 + bx + c`, with prefix of 0x04.
        // * I tried extracting 'x' component of ec public key to use that as
        // * wallet address, but the library does not support calculating 'y'
        // * component of public address from 'x' component.
        // * Therefore, I am settling for Public Key as wallet address for now.
        // TODO: Revisit this
        if (key.getPublic('hex') !== fromAddress) {
            throw new Error(
                'You are attempting to sign someone else\'s Transaction'
            );
        }

        let sign = key.sign(hash);
        return sign.toDER('hex');
    }

    /**
     * @method addTransactionToThePool
     * @memberof Transaction
     * @public
     * @description Verifies the Transaction object and adds it onto the pool.
     * @param {Object} transaction A Transaction object
     */
    addTransactionToThePool(transaction) {
        if (this._transactionPool.length >= this.maxTransactionPoolSize) {
            // broadcast n/w to start mining a block with the current
            // transactionPool
            // Reset the transaction Pool and add transaction to it and return
        }
        // Here transaction.fromAddress acts as a public key
        let isTransactionValid = this.verifyTransaction(transaction,
            transaction.fromAddress);
        // TODO: add a method to check if the transaction is already in pool
        if (isTransactionValid) {
            this._transactionPool.push(transaction);
        } else {
            throw new Error(
                'Attempted to push invalid transaction onto the pool'
            );
        }
    }

    /**
     * @method createTransaction
     * @memberof Transaction
     * @public
     * @description Creates and signs a Transaction object.
     * @param {String} fromAddress Wallet address of the sender
     * @param {String} toAddress Wallet address of the recepient
     * @param {Object} data Data to transact
     * @param {String} privateKey Elliptic Cryptographic(EC) Private Key string of the sender
     * @returns {Object} transaction object containing fromAddress, toAddress,
     * data, timeStamp and Digital signature
     */
    createTransaction(fromAddress, toAddress, data, privateKey) {
        let transaction = {};
        transaction.fromAddress = fromAddress;
        transaction.toAddress = toAddress;
        transaction.data = JSON.stringify(data);
        transaction.timeStamp = Date.now();
        transaction.signature = this._signTransaction(
            transaction.fromAddress,
            this._generateHash(transaction.fromAddress, transaction.toAddress,
                transaction.data, transaction.timeStamp),
            privateKey);
        eventEmitter.emit('BLOCKCHAIN_TRANSACTION_CREATED', transaction);
        return transaction;
    }

    /**
     * @method verifyTransaction
     * @memberof Transaction
     * @public
     * @description Verifies a transaction object
     * @param {Object} transaction object containing fromAddress, toAddress,
     * data, timeStamp and Digital signature
     * @param {String} publicKeyString Public Key of the sender
     * @returns {boolean} True if the transaction is valid
     */
    verifyTransaction(transaction, publicKeyString) {
        let publicKey = this.#ec.keyFromPublic(publicKeyString, 'hex');
        let transactionHash = this._generateHash(transaction.fromAddress,
            transaction.toAddress, transaction.data, transaction.timeStamp);
        let isValidTransaction = publicKey.verify(transactionHash,
            transaction.signature);
        return isValidTransaction;
    }
}

export default new Transaction();
