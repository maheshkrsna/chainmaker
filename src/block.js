import eventEmitter from './blockchainevents';
import sha256 from 'hash.js/lib/hash/sha/256.js';

/**
 * @class Block
 * @description Prototype class to create Block objects for Blockchains
 * @param {string} data Data to be stored inside the Block
 * @param {string} previousHash Hash of the previous Block in the chain
 */
class Block {

    static #interrupt = false;

    /**
     * @method #createBlock
     * @memberof Block
     * @static
     * @private
     * @description Method to create a Blockchain Block
     * @param {String} previousHash Hash of previous Block
     * @param {String} data Stringified array of transactions
     * @param {String} timeStamp time of commissioning the mining of this block
     * @param {String} nonce Random unique number
     * @param {String} hash Hash string of this block
     * @returns {Object} Block of a Blockchain
     */
    static #createBlock = (previousHash, data, timeStamp, nonce, hash) => {
        let block = {};
        block.previousHash = previousHash;
        block.data = data;
        block.timeStamp = Date.now();
        block.nonce = nonce;
        block.hash = hash;

        return block;
    }

    // TODO: Move this function elsewhere
    /**
     * @method #generateHash
     * @memberof Block
     * @static
     * @private
     * @description Method to generate hash of the arguments passed
     * @returns {string} hash generated using sha256
     */
    static #generateHash = (...args) => {
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
     * @method interruptMining
     * @memberof Block
     * @static
     * @public
     * @description Block method to interrupt mining
     */
    static interruptMining() {
        this.#interrupt = true;
    }

    /**
     * @method mineBlock
     * @memberof Block
     * @static
     * @public
     * @description Block method to mine and return a valid block
     * @param {String} previousHash Hash string of the previous block
     * @param {String} data Stringified array of Transaction data
     * @param {Number} difficulty Difficulty level of mining set by n/w
     * @returns {Object} Valid Block of a Blockchain || Error Object generated due to interrupt
     */
    static mineBlock(previousHash, data, difficulty) {
        const timeStamp = Date.now();
        let block = {};
        let difficultyString = Array(difficulty + 1).join('0');
        let hash = '';
        let nonce = -1;

        while( hash.substring(0, difficulty) !== difficultyString ) {
            if (this.#interrupt) {
                this.#interrupt = false;
                return new Error('Mine Block interrupted');
            }
            nonce += 1;
            hash = this.#generateHash(previousHash, data, timeStamp, nonce);
        }

        block = this.#createBlock(previousHash, data, timeStamp, nonce, hash);
        eventEmitter.emit('BLOCKCHAIN_BLOCK_MINED', block);
        return block;
    }
}

export default Block;
