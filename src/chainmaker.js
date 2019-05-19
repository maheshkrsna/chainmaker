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

    /**
     *
     * @method createBlockchain
     * @memberof ChainMaker
     * @public
     * @description Method to create a new Blockchain.
     * @param {String} name Name of the Blockchain.
     */
    createBlockchain(name) {
        this.blockChain = new Blockchain(name);
    }

    /**
     * @method saveBlockChain
     * @memberof ChainMaker
     * @public
     * @description Method to locally save the Blockchain offline.
     * @returns {Promise} Async function to save Blockchain.
     */
    saveBlockChain() {
        return localforage.setItem(this.blockChain.getName(), this.blockChain.getBlockChain())
            .then(() => {
                console.log('Successfully saved Blockchain');
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
            this.blockChain = new Blockchain(name, blockChain);
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
     */
    createWallet() {
        this.#wallet = new Wallet();
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
     */
    createTransaction(toAddress, data) {
        transaction.createTransaction(this.#wallet.getWalletAddress(),
            toAddress, data, this.#wallet.getPrivateKey());
    }

    /**
     * @method getBalance
     * @memberof ChainMaker
     * @public
     * @description Method to get the currency balance of an account on the Blockchain.
     * @param {String} walletAddress Wallet address of the account.
     * @returns {Number} Currency Balance from the Blockchain Ledger.
     */
    getBalance(walletAddress) {
        return this.blockChain.getBalance(walletAddress);
    }

    // mine() {}
}

export let chainmaker = new ChainMaker();

