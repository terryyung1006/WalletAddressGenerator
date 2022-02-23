import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerJsDoc, { Options } from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import * as HDSegwitAddressGenerator from "./src/HDSegwitAddressGenerator"
import * as MultiSigP2SHAddressGenerator from "./src/MultiSigP2SHAddressGenerator"

const app: Application = express();


const swaggerOption: Options = {
    swaggerDefinition: {
        openapi:'3.0.3',
        info: {
            title: "Wallet Address Generator API",
            description: "Wallet Address Generator API Documatation",
            servers: ["http://localhost:5000"],
            version:"1.0.0"
        }
    },
    apis:["app.ts"]
}

app.use(express.json())

const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get('/healthcheck', (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello")
})

/**
 * @openapi
 * /hd_segwit_address/{seed_phase}/{path}:
 *   get:
 *     description: Get Hierarchical Deterministic Segregated Witness bitcoin address by seed phase and path
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         decription: derivation path
 *         schema:
 *             type: string
 *         example: "m/44'/60'/0'/0/0"
 *       - in: path
 *         name: seed_phase
 *         required: true
 *         decription: mnemonic for master key pair
 *         schema:
 *             type: string
 *         example: "recycle manual power sense program car car toy judge response wave chicken"
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/hd_segwit_address/:seed_phase/:path', (req: Request, res: Response, next: NextFunction) => {
    let seedPhase: string = ""
    let path: string = ""
    try {
        seedPhase = req.params.seed_phase
        path = req.params.path
    } catch (e) {
        console.error(e)
        res.status(412).send("input parameters type invalid, please check api document by /api-docs")
        return
    }
    console.log(path);
    
    
    let errMsg = HDSegwitAddressGenerator.checkPath(path)
    errMsg += HDSegwitAddressGenerator.checkSeedPhase(seedPhase)
    
    if (errMsg != "") {
        res.status(412).send(errMsg)
        return
    }

    try {
        let address = HDSegwitAddressGenerator.generateSegwitAddress(seedPhase, path)
        if (!address) {
            res.status(500).send("SegWit address genration failed")
            return
        }
        res.status(200).send(address)
    } catch (e) {
        console.error(e)
        res.status(500).send("SegWit address genration failed")
    }

})

/**
 * @openapi
 * /p2sh_address/{n}/{m}/{public_keys}:
 *   get:
 *     description: Get an n-out-of-m Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address, where n, m and addresses can be specified
 *     parameters:
 *       - in: path
 *         name: n
 *         required: true
 *         decription: minimum number of private keys to unlock UTXO
 *         schema:
 *             type: integer
 *         example: 2
 *       - in: path
 *         name: m
 *         required: true
 *         decription: total number of key pairs
 *         schema:
 *             type: integer
 *         example: 3
 *       - in: path
 *         name: public_keys
 *         required: true
 *         decription: array of public keys, length should be same as n, splited by ","
 *         schema:
 *             type: string
 *         example: "02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2"
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/p2sh_address/:n/:m/:public_keys', (req: Request, res: Response, next:NextFunction) => {
    let n: number = 0
    let m: number = 0
    let publicKeys: Array<string> = []
    try {
        n = parseInt(req.params.n)
        m = parseInt(req.params.m)
        publicKeys = req.params.public_keys.split(",")
    } catch (e) {
        console.error(e)
        res.status(412).send("input parametes type invalid, please check api document by /api-docs")
        return
    }
    console.log(n);
    console.log(m);
    
    console.log(publicKeys);
    
    
    let errMsg = MultiSigP2SHAddressGenerator.checkParams(n, m, publicKeys)
    if (errMsg != "") {
        res.status(412).send(errMsg)
        return
    }

    try {
        let address = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(n, m, publicKeys)
        if (!address) {
            res.status(500).send("P2SH address genration failed")
            return
        }
        res.status(200).send(address)
    } catch (e) {
        console.error(e)
        res.status(500).send("P2SH address genration failed")
    }

})

app.listen(5000, () => console.log("server running"))

export default app