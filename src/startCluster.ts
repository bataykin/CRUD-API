import {UserType} from "./userRepo";
import cluster from "cluster";
import os from "os";
import {usersArray, workersList} from "./main";
import {startServer} from "./startServer";


export type IPCMessage = {
    usersArray: UserType[]
}

export function updateUsersArray(message: IPCMessage) {
    if (message.usersArray) {
        if (cluster.isPrimary) {
            console.log('IPCMessage = ', message.usersArray)
        }
        // console.log('usersArray 1 = ', usersArray)
         // usersArray.push(...message.usersArray)
        if (message.usersArray.length !==0) {
        Object.assign(usersArray, message.usersArray)
        } else {
            // Object.assign(usersArray, {})
            usersArray.length = 0
        }

        if (cluster.isPrimary) {
            console.log('if (cluster.isPrimary ) arr= ', usersArray)
        }
        // console.log('usersArray 2 = ', usersArray)
        // const map = new Map(usersArray.map(pos => [pos.id, pos]));
        // const uniques = [...map.values()];
        // Object.assign( uniques, usersArray)

        // for (let i = 0; i < message.usersArray.length; i++) {
        //     for (let j = 0; j < usersArray.length; j++) {
        //         if (usersArray[j].id != message.usersArray[i].id) usersArray.push(message.usersArray[i])
        //     }
        // }

    }
}

export function startClusters() {

    if (cluster.isPrimary) {
        // cluster.worker?.send({usersArray: usersArray})
        // process.on("message", (message: IPCMessage) => {
        //     updateUsersArray(message)
        //     console.log('msg to master')
        // })

        const cpusCount = 3 || os.cpus().length
        let portNumber: number = +process.env.PORT! || 5000
        console.log(`Primary process on PORT=${portNumber} `)

        for (let i = 0; i < cpusCount; i++) {
            portNumber++
            const worker = cluster
                .fork({PORT: portNumber})
                .on('message', function (message: IPCMessage) {

                    console.log(`message from child pid=${process.pid}: `, message.usersArray);
                    updateUsersArray(message)
                    console.log('arr in master = ', usersArray)
                    for (let id in cluster.workers) {
                            cluster.workers[id]!.send({usersArray: usersArray});
                    }

                    // cluster.on("message", function (worker, message, handle) {
                    //     console.log('message from master: ', message);
                    //     usersArray.push(...message.usersArray)
                    // })

                    // usersArray.push(...message.usersArray)
                    // console.log(usersArray)
                    // worker.send('Hello from master!');
                })

            cluster.on('exit', function(worker, code, signal) {
                console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
                console.log('Starting a new worker');
                cluster.fork();
            })

            workersList.push({id: worker.id, pid: worker.process.pid})
            // worker.send({usersArray: usersArray})
            // cluster.worker?.send('hello from the master');
        }


        // console.log(workersList)
        // cluster.on("message", function (worker, message, handle) {
        //     console.log('message from master: ', message);
        //     usersArray.push(...message.usersArray)
        // })

        // server.on("finish", async (req: IncomingMessage) => {
        //     console.log('server finish')
        //     const parsedURL: Array<string> = req.url!.split('/').slice(1)
        //     if (parsedURL[0] + '/' + parsedURL[1] == BASEURL) {
        //         for (const workersListElement of workersList) {
        //             cluster.worker?.send(JSON.stringify({usersArray: usersArray}))
        //         }
        //         // process.send!({usersArray: usersArray});
        //     }
        // })


        startServer()

        // cluster.on("message", function (worker, message, handle) {
        //     console.log('cluster message from child to Primary: ', message);
        //     updateUsersArray(message)
        // })

    } else if (cluster.isWorker) {

        // process.on("message", (message: IPCMessage) => {
        //     console.log('message from master: ', message);
        //     updateUsersArray(message)
        //     // usersArray.push(...message.usersArray)
        //     // Object.assign(usersArray, message.usersArray)
        //     // console.log(usersArray)
        //     // worker.send('Hello from master!');
        // });


        startServer()

        // cluster.on("message", function (worker, message, handle) {
        //     console.log('cluster message from master: ', message);
        //     usersArray.push(...message.usersArray)
        // })

        process.on('message', function (message: IPCMessage) {
            console.log(`message from master pid=${process.pid} to Worker: `, message.usersArray);
            updateUsersArray(message)

        });

        // process.send('  ', )

        // server.on("finish", async (req: IncomingMessage) => {
        //     const parsedURL: Array<string> = req.url!.split('/').slice(1)
        //     if (parsedURL[0] + '/' + parsedURL[1] == BASEURL) {
        //         process.send!({usersArray: usersArray});
        //     }
        // })

        // console.log(`Worker started at PORT=${process.env.PORT} PID=${process.pid} ID=${cluster.worker?.id}`)
    }

    cluster.on('death', function (worker) {
        console.log('Worker ' + worker.pid + ' died.');
    });
}
