import elliptic from 'elliptic';
import eventEmitter from './blockchainevents';
import sha256 from 'hash.js/lib/hash/sha/256.js';

let EllipticCryptography = elliptic.ec;
let ec = new EllipticCryptography('secp256k1');

/**
 * @class Transaction
 * @description Class to create and verify transactions
 */
class Transaction {

    #transactionPool;
    #maxTransactionPoolSize;

    constructor() {
        this.#transactionPool = [];
        this.#maxTransactionPoolSize = 10;
    }

    /**
     * @method transactionPool
     * @memberof Transaction
     * @public
     * @description Returns the transaction pool.
     * @returns {Array} Transaction Pool.
     */
    get transactionPool() {
        return this.#transactionPool;
    }

    /**
     * @method transactionPoolSize
     * @memberof Transaction
     * @public
     * @description Gets the transaction pool size.
     * @returns {Number} Transaction Pool Size.
     */
    get transactionPoolSize() {
        return this.#maxTransactionPoolSize;
    }

    /**
     * @method transactionPoolSize
     * @memberof Transaction
     * @public
     * @description Gets the transaction pool size.
     * @param {Number} size Transaction Pool Size.
     */
    set transactionPoolSize(size) {
        this.#maxTransactionPoolSize = size;
    }

    /**
     * @method _generateHash
     * @memberof Transaction
     * @private
     * @description Generates a hash.
     * @returns {string} hash generated using sha256
     */
    _generateHash(...args) {
        if (args.length === 0) {
            throw new Error('There is no data to hash');
        }
        let dataToHash = '';
        args.forEach((arg) => {
            dataToHash += arg;
        });
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
        let key = ec.keyFromPrivate(privateKey, 'hex');
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
        if (this.#transactionPool.length >= this.#maxTransactionPoolSize) {
            // broadcast n/w to start mining a block with the current
            // transactionPool
            // Reset the transaction Pool and add transaction to it and return
        }
        // Here transaction.fromAddress acts as a public key
        let isTransactionValid = this.verifyTransaction(transaction,
            transaction.fromAddress);
        // TODO: add a method to check if the transaction is already in pool
        if (isTransactionValid) {
            this.#transactionPool.push(transaction);
        } else {
            throw new Error(
                'Attempted to push invalid transaction onto the pool'
            );
        }
    }

    /**
     * @method clearTransactionPool
     * @memberof Transaction
     * @public
     * @description Clears the Transaction Pool.
     * @returns {Object} this Reference to self to enable method chaining
     */
    clearTransactionPool() {
        this.#transactionPool = [];
        return this;
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
        // Do not allow transactions if there are any other transactions pending in the pool
        if(this.isAnyTransactionPending(fromAddress)) {
            throw new Error(`There is already one Transaction pending from this Address: 
                ${fromAddress}`);
        }

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
     * @method isAnyTransactionPending
     * @memberof Transaction
     * @public
     * @description Checks the Transaction Pool for any pending transaction from the address.
     * @param {String} fromAddress Address whose transaction to be queried for.
     * @returns {boolean} boolean value indicating whether transaction is present or not.
     */
    isAnyTransactionPending(fromAddress) {
        for(let i = 0; i < this.#transactionPool.length; i++) {
            if(fromAddress === this.#transactionPool[i].fromAddress) {
                return true;
            }
        }
        return false;
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
        let publicKey = ec.keyFromPublic(publicKeyString, 'hex');
        let transactionHash = this._generateHash(transaction.fromAddress,
            transaction.toAddress, transaction.data, transaction.timeStamp);
        let isValidTransaction = publicKey.verify(transactionHash,
            transaction.signature);
        return isValidTransaction;
    }
}

export default Transaction;
