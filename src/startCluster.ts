import {UserType} from "./userTypes";
import cluster from "cluster";
import os from "os";
import {usersArray, workersList} from "./main";
import {startServer} from "./startServer";


export type IPCMessage = {
    usersArray: UserType[]
}

export function updateUsersArray(message: IPCMessage) {
    if (message.usersArray) {
        if (message.usersArray.length !==0) {
        Object.assign(usersArray, message.usersArray)
        } else {
            usersArray.length = 0
        }
    }
}

export function startClusters() {
    if (cluster.isPrimary) {
        const cpusCount = os.cpus().length || 4
        let portNumber: number = +process.env.PORT! || 5000
        console.log(`Primary process on PORT=${portNumber} `)

        for (let i = 0; i < cpusCount; i++) {
            portNumber++
            const worker = cluster
                .fork({PORT: portNumber})
                .on('message', function (message: IPCMessage) {
                    console.log(`message from child pid=${process.pid}: `, message.usersArray);
                    updateUsersArray(message)
                    for (let id in cluster.workers) {
                            cluster.workers[id]!.send({usersArray: usersArray});
                    }
                })

            workersList.push({id: worker.id, pid: worker.process.pid})
        }
        cluster.on('exit', (worker, code) => {
            console.log(`Worker terminated! Pid: ${worker.process.pid} Code: ${code}`);
            // Restart worker only after specific error
            if (code === 1) {
                const newWorker = cluster.fork();
                workersList.push({id: newWorker.id, pid: newWorker.process.pid})
            }
        });
        startServer()
        cluster.schedulingPolicy = cluster.SCHED_RR;
    } else if (cluster.isWorker) {
        startServer()

        process.on('message', function (message: IPCMessage) {
            console.log(`message from master pid=${process.pid} to Worker: `, message.usersArray);
            updateUsersArray(message)
        });
    }
    cluster.on('death', function (worker) {
        console.log('Worker ' + worker.pid + ' died.');
    });
}
