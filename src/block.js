import sha256 from 'hash.js/lib/hash/sha/256.js';

/**
 * @class Block
 * @description Prototype class to create Block objects for Blockchains
 * @param {string} data Data to be stored inside the Block
 * @param {string} previousHash Hash of the previous Block in the chain
 */
class Block {

    /**
     * @method _createBlock
     * @memberof Block
     * @private
     * @description Method to create a Blockchain Block
     * @param {String} previousHash Hash of previous Block
     * @param {String} data Stringified array of transactions
     * @param {String} timeStamp time of commissioning the mining of this block
     * @param {String} nonce Random unique number
     * @param {String} hash Hash string of this block
     * @returns {Object} Block of a Blockchain
     */
    _createBlock(previousHash, data, timeStamp, nonce, hash) {
        let block = {};
        block.previousHash = previousHash;
        block.data = data;
        block.timeStamp = Date.now();
        block.nonce = nonce;
        block.hash = hash;

        return block;
    }

    /**
     * @method _generateHash
     * @memberof Block
     * @private
     * @description Method to generate hash of the arguments passed
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
     * @method mineBlock
     * @memberof Block
     * @public
     * @description Block method to mine and return a valid block
     * @param {String} previousHash Hash string of the previous block
     * @param {String} data Stringified array of Transaction data
     * @param {Number} difficulty Difficulty level of mining set by n/w
     * @returns {Object} Valid Block of a Blockchain
     */
    mineBlock(previousHash, data, difficulty) {
        const timeStamp = Date.now();
        let block = {};
        let difficultyString = Array(difficulty + 1).join('0');
        let hash = '';
        let nonce = -1;

        while( hash.substring(0, difficulty) !== difficultyString ) {
            nonce += 1;
            hash = this._generateHash(previousHash, data, timeStamp, nonce);
        }

        block = this._createBlock(previousHash, data, timeStamp, nonce, hash);

        return block;
    }
}

export default new Block();
