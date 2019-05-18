import elliptic from 'elliptic';

/**
 * @class Wallet
 * @description Class to Create Crypto Wallets.
 */
class Wallet {
    #keyPair;
    #privateKey;
    #publicKey;
    #walletAddress;

    constructor(name, privateKey) {
        let EllipticCryptography = elliptic.ec;
        let ec = new EllipticCryptography('secp256k1');
        if (privateKey) {
            this.#keyPair = ec.keyFromPrivate(privateKey, 'hex');
        } else {
            this.#keyPair = ec.genKeyPair();
        }
        this.#privateKey = this.#keyPair.getPrivate('hex');
        this.#publicKey = this.#keyPair.getPublic('hex');
        // * Elliptic cryptography offers us a public key in form of
        // * `y^2 = ax^3 + bx + c`, with prefix of 0x04.
        // * I tried extracting 'x' component of ec public key to use that as
        // * wallet address, but the library does not support calculating 'y'
        // * component of public address from 'x' component.
        // * Therefore, I am settling for Public Key as wallet address for now.
        // TODO: Revisit this
        this.#walletAddress = this.#publicKey;
    }

    /**
     * @method getPublicKey
     * @memberof Wallet
     * @public
     * @description Method to get the Public Key from the Wallet.
     * @returns {String} publicKey Public Key from the Wallet.
     */
    getPublicKey() {
        return this.#publicKey;
    }

    /**
     * @method getPrivateKey
     * @memberof Wallet
     * @public
     * @description Method to get the Private Key from the Wallet.
     * @returns {String} privateKey Private Key from the Wallet.
     */
    getPrivateKey() {
        return this.#privateKey;
    }

    /**
     * @method getWalletAddress
     * @memberof Wallet
     * @public
     * @description Method to get the Wallet Address.
     * @returns {String} walletAddress Wallet Address.
     */
    getWalletAddress() {
        return this.#walletAddress;
    }
}

export default Wallet;
