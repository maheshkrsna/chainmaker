import sha256 from 'hash.js/lib/hash/sha/256.js';

/**
 * @class Block
 * @description Prototype class to create Block objects for Blockchains
 * @param {string} data Data to be stored inside the Block
 * @param {string} previousHash Hash of the previous Block in the chain
 */
class Block {

    /**
     *
     * @method _createBlock
     * @memberof Block
     * @private
     * @param {String} previousHash Hash of previous Block
     * @param {String} data Data to be stored in the Block
     * @param {Number} nonce Random number that is used for Proof of work
     * @returns {Object} Block of a Blockchain
     */
    _createBlock(previousHash, data, nonce) {
        let block = {};
        block.previousHash = previousHash;
        block.data = data;
        block.timeStamp = Date.now();
        block.nonce = nonce;
        block.hash = this._generateHash(block.previousHash, block.data,
            block.timeStamp, block.nonce);

        return block;
    }

    /**
     * @method _generateHash
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
}

export default new Block();
