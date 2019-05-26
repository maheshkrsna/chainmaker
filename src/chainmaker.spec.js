import { chainmaker } from './chainmaker';
import localforage from 'localforage';
import sinon from 'sinon';

describe('Chainmaker', () => {
    beforeEach(() => {
        Date.now = () => {
            const NOW_IN_MILLISECONDS = 1556475677127;
            return NOW_IN_MILLISECONDS;
        };
    });

    describe('Wallet', () => {
        let walletAddress;
        beforeEach(() => {
            walletAddress = chainmaker.createWallet().getWalletAddress();
        });

        it('should create a new Wallet address of length 130 characters', () => {
            const walletAddressCharLength = 130;
            walletAddress.length.should.equal(walletAddressCharLength);
        });

        it('should save wallet address locally', () => {
            localforage.setItem = sinon.fake.returns(new Promise(
                (resolve) => resolve(true)
            ));
            chainmaker.saveWallet();
            sinon.assert.calledWith(localforage.setItem,
                walletAddress);
        });
    });
});
