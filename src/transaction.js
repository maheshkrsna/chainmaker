import sha256 from 'hash.js/lib/hash/sha/256.js';
import elliptic from 'elliptic';

/**
 * @class Transaction
 * @description Class to create and verify transactions
 */
class Transaction {

    /**
     * @method _generateHash
     * @private
     * @returns {string} hash generated using sha256
     * @memberof Block
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
     *
     * @method _signTransaction
     * @memberof Transaction
     * @private
     * @param {String} fromAddress Wallet address of the sender
     * @param {String} hash Hash of the data to be signed
     * @param {Object} key Elliptic Cryptograhic(EC) Key Object of the sender
     * @returns {string} Digital Signature
     */
    _signTransaction(fromAddress, hash, key) {
        // * Here we are assuming that the wallet address is
        // * derived from the 'X' component of elliptic curve public key
        if (key.getPublic().getX().toString('hex') !== fromAddress) {
            throw new Error(`You are attempting to sign someone 
            else's Transaction`);
        }

        let sign = key.sign(hash);
        return sign.toDER('hex');
    }

    /**
     *
     * @method createTransaction
     * @memberof Transaction
     * @public
     * @param {String} fromAddress Wallet address of the sender
     * @param {String} toAddress Wallet address of the recepient
     * @param {String} data Data to transact
     * @param {Object} key Elliptic Cryptograhic(EC) Key Object of the sender
     * @returns {Object} transaction object containing fromAddress, toAddress,
     * data, timeStamp and Digital signature
     */
    createTransaction(fromAddress, toAddress, data, key) {
        let transaction = {};
        transaction.fromAddress = fromAddress;
        transaction.toAddress = toAddress;
        transaction.data = data;
        transaction.timeStamp = Date.now();
        transaction.signature = this._signTransaction(
            transaction.fromAddress,
            this._generateHash(transaction.fromAddress, transaction.toAddress,
                transaction.data, transaction.timeStamp),
            key);

        return transaction;
    }

    /**
     *
     * @method verifyTransaction
     * @memberof Transaction
     * @public
     * @param {Object} transaction object containing fromAddress, toAddress,
     * data, timeStamp and Digital signature
     * @param {String} publicKeyString Public Key of the sender
     * @returns {boolean} True if the transaction is valid
     */
    verifyTransaction(transaction, publicKeyString) {
        let EllipticCryptography = elliptic.ec;
        let ec = new EllipticCryptography('secp256k1');
        let publicKey = ec.keyFromPublic(publicKeyString, 'hex');

        let transactionHash = this._generateHash(transaction.fromAddress,
            transaction.toAddress, transaction.data, transaction.timeStamp);
        let isValidTransaction = publicKey.verify(transactionHash,
            transaction.signature);
        return isValidTransaction;
    }
}

export default new Transaction();
