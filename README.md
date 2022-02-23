# WalletAddressGenerator

# Objective
1. Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin
address from a given seed and path
2. Generate an n-out-of-m Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin
address, where n, m and addresses can be specified

# Hierarchical Deterministic(HD)
* Hierarchical deterministic wallet uses 12-24 words(seed phase) to derive master private key, which can be used in larger company or institution. 
* Multiple sub keys with different ability and purpose can be set by the derivation path.
For more details:
https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

# Segregated Witness(SegWit)
* Soft fork in bitcoin chain for increasing block capacity and preventing from transaction malleability attack. 
* Native segWit address start with "bc1".
For more details:
https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki

# Multisignature(Multi-sig) Pay-To-Script-Hash(P2SH)
* multi-sig refers to requiring multiple keys to authorize a Bitcoin transaction, rather than a single signature from one key.
* n-out-of-m backup where loss of a single seed doesn't lead to loss of the wallet.
* P2SH solve the runtime issue caused by length of keys for multi-sig addresses transaction
https://github.com/bitcoin/bips/blob/master/bip-0067.mediawiki

# Installation
Install dependencies
```
npm install
```

# Usage
Run for development using nodemon
```
npm run dev
```
Run for production
```
npm run build
npm start
```
For documentation on different API, while server is running locally, please route to 
**http://localhost:5000/api_docs**

# Testing
Test with jest
```
npm run test
```
Including api call tests and function tests with successful cases and failed cases with invalid input parameters.

# Demo and example
While server is running locally, click on "Try it out" and "Execute":
**http://localhost:8000/api_docs/#/default/get_hd_segwit_address__seed_phase___path_**

**http://localhost:8000/api_docs/#/default/get_p2sh_address__n___m___public_keys_**

or use postman with parameters similar to api_docs examples.

# Potential Improvement
* Add passphase for Mnemonic Seed Sync
* Functions in src folder can be devided for single responsibility
* CICD pipeline can be set for deployment automation
