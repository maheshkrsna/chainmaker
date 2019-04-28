import { sha256 } from 'hash.js';

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
        this.hash = this.calculateHash();
    }

    /**
     * @method calculateHash
     * @returns {string} hash generated using sha256
     * @memberof Block
     */
    calculateHash() {
        let hash = sha256()
            .update(this.previousHash + this.data + this.timeStamp)
            .digest('hex')
            .toString();
        return hash;
    }
}

export default Block;
