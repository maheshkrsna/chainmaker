import Block from './block';
import Blockchain from './blockchain';
import localforage from 'localforage';
import Transaction from './transaction';
import Wallet from './wallet';

let transaction = new Transaction();

/**
 * @class ChainMaker
 * @description Class to Create, Read and Update BlockChains
 */
class ChainMaker {
    #wallet;
    #blockChain;

    /**
     *
     * @method createBlockchain
     * @memberof ChainMaker
     * @public
     * @description Method to create a new Blockchain.
     * @param {String} name Name of the Blockchain.
     * @returns {Object} this Reference to self to enable method chaining
     */
    createBlockchain(name) {
        this.#blockChain = new Blockchain(name);
        return this;
    }

    /**
     * @method saveBlockChain
     * @memberof ChainMaker
     * @public
     * @description Method to locally save the Blockchain offline.
     * @returns {Promise} Async function to save Blockchain.
     */
    saveBlockChain() {
        return localforage.setItem(this.#blockChain.getName(),
            this.#blockChain.getBlockChain())
            .then(() => {
                console.log('Successfully saved Blockchain');
                return this;
            }).catch((error) => {
                console.log('Failed to save Blockchain');
                console.log(error);
            });
    }

    /**
     * @method loadBlockChain
     * @memberof ChainMaker
     * @public
     * @description Method to load locally saved Blockchain.
     * @param {String} name Name of the Blockchain.
     */
    loadBlockChain(name) {
        localforage.getItem(name).then((blockChain) => {
            this.#blockChain = new Blockchain(name, blockChain);
            return this;
        }).catch((error) => {
            console.log('Failed to load Blockchain');
            console.log(error);
        });
    }

    /**
     * @method createWallet
     * @memberof ChainMaker
     * @public
     * @description Method to create a crypto wallet containing crypto keys and wallet address.
     * @returns {Object} this Reference to self to enable method chaining
     */
    createWallet() {
        this.#wallet = new Wallet();
        return this;
    }

    /**
     * @method getWalletAddress
     * @memberof ChainMaker
     * @public
     * @description Method to obtain wallet address.
     * @returns {String} wallet address.
     */
    getWalletAddress() {
        return this.#wallet.getWalletAddress();
    }

    /**
     * @method saveWallet
     * @memberof ChainMaker
     * @public
     * @description Method to save wallet address.
     * @returns {Promise} Async function to save Wallet private key.
     */
    saveWallet() {
        return localforage.setItem(this.#wallet.getWalletAddress(),
            this.#wallet.getPrivateKey())
            .then(() => {
                console.log('Successfully saved Wallet');
                return this;
            }).catch((error) => {
                console.log('Failed to save Wallet');
                console.log(error);
            });
    }

    /**
     * @method loadWallet
     * @memberof ChainMaker
     * @public
     * @description Method to load locally saved Wallet Private Key.
     * @param {String} walletAddress Wallet address.
     */
    loadWallet(walletAddress) {
        localforage.getItem(walletAddress).then((walletPrivateKey) => {
            this.#wallet = new Wallet(walletPrivateKey);
            return this;
        }).catch((error) => {
            console.log('Failed to load Wallet');
            console.log(error);
        });
    }

    /**
     * @method createTransaction
     * @memberof ChainMaker
     * @public
     * @description Method to create a Transaction on the Blockchain.
     * @param {String} toAddress Wallet address of the Recipient.
     * @param {String} data data to be transferred.
     * @returns {Object} this Reference to self to enable method chaining
     */
    createTransaction(toAddress, data) {
        let balance = 0;
        if(data.type == 'currency') {
            balance = this.#blockChain.getBalance(this.getWalletAddress);
            if(balance >= data.value) {
                transaction.createTransaction(this.#wallet.getWalletAddress(),
                    toAddress, data, this.#wallet.getPrivateKey());
            } else {
                throw new Error(`Transaction amount exceeds balance: ${balance}`);
            }
        } else {
            transaction.createTransaction(this.#wallet.getWalletAddress(),
                toAddress, data, this.#wallet.getPrivateKey());
        }

        return this;
    }

    /**
     * @method mine
     * @memberof ChainMaker
     * @public
     * @description Method to mine a block with given difficulty
     * @param {Number} difficulty level of mining set by n/w
     * @returns {Object} Valid Block of a Blockchain || Error Object generated due to interrupt
     */
    mine(difficulty) {
        let minedBlock = Block.mineBlock(this.#blockChain.getLastBlockHash,
            transaction.transactionPool, difficulty);
        return minedBlock;
    }
}

export let chainmaker = new ChainMaker();

