import Block from './block';
import sha256 from 'hash.js/lib/hash/sha/256.js';

/**
 * @class BlockChain
 * @description Prototype class to create a BlockChain Object.
 */
class BlockChain {
    constructor() {
        this.chain = [];
        let GenesisBlock = Block.mineBlock('0',
            JSON.stringify([JSON.stringify(
                {
                    fromAddress: '0',
                    toAddress: '0',
                    data: JSON.stringify({type: 'data', value: 'This is Genesis Block Data'}),
                    timeStamp: Date.now
                }
            )]),
            1
        );
        this.chain.push(GenesisBlock);
    }

    /**
     * @method _generateHash
     * @memberof BlockChain
     * @private
     * @description Method to generate hash of the arguments passed.
     * @returns {string} hash generated using sha256.
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
     * @method addBlock
     * @memberof BlockChain
     * @public
     * @description Method to add a valid Block Object onto the BlockChain.
     * @param {Object} block Block Object to be added to the BlockChain.
     */
    addBlock(block) {
        this.chain.push(block);
    }

    /**
     * @method getBalance
     * @memberof BlockChain
     * @public
     * @description Method to get currency balance on the BlockChain Ledger.
     * @param {String} address wallet address whose balance is queried for
     * @returns {Number} Currency Balance from the BlockChain Ledger.
     */
    getBalance(address) {
        let balance = 0;
        // for each block inside blockchain
        for (let i = 0; i < this.chain.length; i++) {
            // data property of the block containing an array of transactions
            let blockDataObj = JSON.parse(this.chain[i].data);
            // for each block.data inside block
            for(let j = 0; j < blockDataObj.length; j++) {
                let dataTransactionObj = JSON.parse(blockDataObj[j]);
                let transactionData = JSON.parse(dataTransactionObj.data);
                // for each transaction data inside block.data
                if((dataTransactionObj.toAddress === address) &&
                (transactionData.type === 'currency')) {
                    balance += transactionData.value;
                }
                if((dataTransactionObj.fromAddress === address) &&
                (transactionData.type === 'currency')) {
                    balance -= transactionData.value;
                }
            }
        }
        return balance;
    }

    /**
     * @method getBlock
     * @memberof BlockChain
     * @public
     * @description Method to return the Block Object containing the queried Hash.
     * @param {String} blockHash Hash of the Block Object queried for.
     * @returns {Object} The Block Object containing the queried Hash.
     */
    getBlock(blockHash) {
        for (let i = 0; i < this.chain.length; i++) {
            if(this.chain[i].hash === blockHash) {
                return this.chain[i];
            }
        }
        return null;
    }

    /**
     * @method getBlockChain
     * @memberof BlockChain
     * @public
     * @description Method to get a clone of blockchain.
     * @returns {Array} An array of blocks.
     */
    getBlockChain() {
        return this.chain.slice(0);
    }

    /**
     * @method getLastBlockHash
     * @memberof BlockChain
     * @public
     * @description Method to get the last block's hash of the Blockchain.
     * @returns {String} Hash of the last block in the Blockchain.
     */
    getLastBlockHash() {
        const chainLength = this.chain.length;
        return this.chain[chainLength - 1].hash;
    }

    /**
     * @method getTransaction
     * @memberof BlockChain
     * @public
     * @description Method to get all Transactions between two addresses.
     * @param {String} fromAddress From Addresses in Transactions or Wildcard '*'.
     * @param {String} toAddress To Addresses in Transactions or Wildcard '*'.
     * @returns {Array} List of Transactions between the two addresses queried for.
     */
    getTransaction(fromAddress, toAddress) {
        let transactions = [];

        // for each block inside blockchain
        for (let i = 0; i < this.chain.length; i++) {
            let blockDataObj = JSON.parse(this.chain[i].data);
            // for each block.data inside block
            for (let j=0; j < blockDataObj.length; j++) {
                let dataTransactionObj = JSON.parse(blockDataObj[j]);
                // for each transaction data inside block
                if ((fromAddress === '*' || dataTransactionObj.fromAddress === fromAddress)
                 && (toAddress === '*' || dataTransactionObj.toAddress === toAddress)) {
                    transactions.push(dataTransactionObj);
                }
            }
        }
        return transactions;
    }
}

export default BlockChain;
