import * as dotenv from 'dotenv'
import * as http from 'node:http';
import {Server} from "http";
import {UserType} from "./userTypes";
import {startClusters} from "./startCluster";
import {startServer} from "./startServer";

dotenv.config()
export const usersArray: Array<UserType> = []
export let server: http.Server<typeof http.IncomingMessage,
    typeof http.ServerResponse>
export const BASEURL: string = 'api/users'
export const workersList: { id: number, pid: number | undefined }[] = [/*{id: 0, pid: process.pid}*/]

server = http.createServer();


if (process.env.TYPE !== 'SINGLE') startClusters()
startServer()

