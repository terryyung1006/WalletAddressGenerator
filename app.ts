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

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("index~")
})

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
 *         description: derivation path, for more details https://learnmeabitcoin.com/technical/derivation-paths
 *         schema:
 *             type: string
 *         example: "m/44'/60'/0'/0/0"
 *       - in: path
 *         name: seed_phase
 *         required: true
 *         description: mnemonic for master key pair
 *         schema:
 *             type: string
 *         example: "recycle manual power sense program car car toy judge response wave chicken"
 *     responses:
 *       200:
 *         description: OK
 *       412:
 *         description: input invalid
 *       500:
 *         description: internal server error
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
    
    
    let errMsg = HDSegwitAddressGenerator.checkSeedPhase(seedPhase)
    
    if (errMsg != "") {
        res.status(412).send(errMsg)
        return
    }

    try {
        let address = HDSegwitAddressGenerator.generateSegwitAddress(seedPhase, path)
        if (!address) {
            throw "result address empty"
        }
        res.status(200).send(address)
    } catch (e) {
        console.error(e)
        res.status(400).send("SegWit address genration failed, please check if seed phase and path valid.")
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
 *         description: minimum number of private keys to unlock UTXO
 *         schema:
 *             type: integer
 *         example: 2
 *       - in: path
 *         name: m
 *         required: true
 *         description: total number of key pairs
 *         schema:
 *             type: integer
 *         example: 3
 *       - in: path
 *         name: public_keys
 *         required: true
 *         description: array of public keys, length should be same as m
 *         schema:
 *             type: array
 *             items:
 *               type: string
 *         example: ["026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01","02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9","023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59"]
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: bad request
 *       412:
 *         description: input invalid
 *       500:
 *         description: internal server error
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
        res.status(412).send("input parameters type invalid, please check api document by /api_docs")
        return
    }
    
    
    let errMsg = MultiSigP2SHAddressGenerator.checkParams(n, m, publicKeys)
    if (errMsg != "") {
        res.status(412).send(errMsg)
        return
    }

    try {
        let address = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(n, m, publicKeys)
        if (!address) {
            throw "result address empty"
        }
        res.status(200).send(address)
    } catch (e) {
        console.error(e)
        res.status(400).send("P2SH address genration failed, please check if public keys valid.")
    }

})

app.listen(5000, () => console.log("server running on port 5000"))

export default app