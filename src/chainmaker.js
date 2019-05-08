import BlockChain from './blockchain';

class ChainMaker {
    createBlockChain() {
        this.blockChain = new BlockChain();
        return this.blockChain;
    }
}

export let chainmaker = new ChainMaker();

