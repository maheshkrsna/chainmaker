import Blockchain from './blockchain';
import localforage from 'localforage';

/**
 * @class ChainMaker
 * @description Class to Create, Read and Update BlockChains
 */
class ChainMaker {

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
}

export let chainmaker = new ChainMaker();

