import express from "express"
import cors from 'cors'

import { setupSwagger } from '../swagger'
import { Connection } from '../database/mongoose'
import { startDailyScheduler } from "../utils/scheduler";

import router from "../route"

export class App {
    public server: express.Application

    constructor() {
        this.server = express()
        this.server.get('/', (_req, res) => res.json({ message: 'root route' }))
        this.connection()
        this.middleware()
        this.routes()
        this.documentation()
        startDailyScheduler()
        
    }

    private middleware() {
        this.server.use(cors())
        this.server.use(express.json())
    }

    private routes() {
        this.server.use('/api', router)
    }

    private documentation() {
        setupSwagger(this.server)
    }

    private async connection() {
        await Connection.connect()
    }

}