# ChainMaker (beta)
-------------------------------------------------------------
This is a npm module to create, read and update blockchains for **browser/chromium** environment.
>This module is a work in progress and to be used only for beta testing until an official production realease is announced.

Feel free to drop in your suggestions to fsdevkris@gmail.com

## Install
-------------------------------------------------------------

```
npm install chainmaker
```

## API
-------------------------------------------------------------

## ChainMaker()
### new ChainMaker()
Class to Create, Read and Update BlockChains.

#### Methods
-------------------------------------------------------------
* ##### (static) createBlockchain(name) → {Object}
    Method to create a new Blockchain.
    **Parameters:**
    |Name	|Type	|Description            |
    |-------|-------|-----------------------|
    |name	|String	|Name of the Blockchain.|

    **Returns:**
    this Reference to self to enable method chaining
    **Type:** Object

* ##### (static) createTransaction(toAddress, data) → {Object}
    Method to create a Transaction on the Blockchain.
    **Parameters:**
    |Name	    |Type	|Description                        |
    |-----------|-------|-----------------------------------|
    |toAddress	|String	|Wallet address of the Recipient.   |
    |data	    |Object	|data to be transferred.            |

    **Returns:**
    this Reference to self to enable method chaining
    **Type:** Object

* ##### (static) createWallet() → {Object}
    Method to create a crypto wallet containing crypto keys and wallet address.

    **Returns:**
    this Reference to self to enable method chaining
    **Type:** Object

* ##### (static) getWalletAddress() → {String}
    Method to obtain wallet address.

    **Returns:**
    wallet address.
    **Type:** String

* ##### (static) loadBlockChain(name)
    Method to load locally saved Blockchain.
    **Parameters:**
    |Name	|Type	|Description            |
    |-------|-------|-----------------------|
    |name	|String	|Name of the Blockchain.|

* ##### (static) loadWallet(walletAddress)
    Method to load locally saved Wallet Private Key.
    **Parameters:**
    |Name	        |Type	|Description    |
    |---------------|-------|---------------|
    |walletAddress	|String	|Wallet address.|

* ##### (static) mine(difficulty) → {Object}
    Method to mine a block with given difficulty
    **Parameters:**
    |Name	    |Type	|Description                |
    |-----------|-------|---------------------------|
    |difficulty	|Number	|level of mining set by n/w.|

    **Returns:**
    Valid Block of a Blockchain || Error Object generated due to interrupt
    **Type:** Object

* ##### (static) saveBlockChain() → {Promise}
    Method to locally save the Blockchain offline.

    **Returns:**
    Async function to save Blockchain.
    **Type:** Promise

* ##### (static) saveWallet() → {Promise}
    Method to save wallet address.

    **Returns:**
    Async function to save Wallet private key.
    **Type:** Promise
