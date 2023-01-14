import * as dotenv from 'dotenv'
import * as http from 'node:http';
import {Server} from "http";
import {UserType} from "./userRepo";
import {startClusters} from "./startCluster";

dotenv.config()
export const usersArray: Array<UserType> = []
export const server: Server = http.createServer();
export const BASEURL: string = 'api/users'
export const workersList: { id: number, pid: number | undefined }[] = [/*{id: 0, pid: process.pid}*/]



 startClusters()
