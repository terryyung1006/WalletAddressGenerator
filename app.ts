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

const swaggerDocs = swaggerJsDoc(swaggerOption);
console.log(swaggerDocs);

app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get('/healthCheck', (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello")
})

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/HDSegwitAddress', (req: Request, res: Response, next: NextFunction) => {
    let seedPhase: string = ""
    let path: string = ""
    try {
        seedPhase = req.body.seed_phase
        path = req.body.path
    } catch (e) {
        console.error(e)
        res.status(412).send("input parameters type invalid, please check api document by /api-docs")
        return
    }
    
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
        res.status(500).send("SegWit address genration failed")
    }

})

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/MultiSigP2SHAddress', (req: Request, res: Response, next:NextFunction) => {
    let m: number = 0
    let n: number = 0
    let publicKeys: Array<string> = []
    try {
        m = req.body.m
        n = req.body.n
        publicKeys = req.body.public_keys
    } catch (e) {
        console.error(e)
        res.status(412).send("input parametes type invalid, please check api document by /api-docs")
        return
    }
    
    let errMsg = MultiSigP2SHAddressGenerator.checkParams(m, n, publicKeys)
    if (errMsg != "") {
        res.status(412).send(errMsg)
        return
    }

    try {
        let address = MultiSigP2SHAddressGenerator.generateMultiSigP2SHAddress(m, n, publicKeys)
        if (!address) {
            res.status(500).send("P2SH address genration failed")
            return
        }
        res.status(200).send(address)
    } catch (e) {
        res.status(500).send("P2SH address genration failed")
    }

})

app.listen(5000, ()=>console.log("server running"))