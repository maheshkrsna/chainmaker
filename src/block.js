import sha256 from 'hash.js/lib/hash/sha/256.js';

/**
 * @class Block
 * @description Prototype class to create Block objects for Blockchains
 * @param {string} data Data to be stored inside the Block
 * @param {string} previousHash Hash of the previous Block in the chain
 */
class Block {
    constructor(data, previousHash) {
        this.data = data.toString();
        this.previousHash = previousHash;
        this.timeStamp = Date.now();
        this.hash = this._generateHash(this.data,
            this.previousHash, this.timeStamp);
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

export default Block;
