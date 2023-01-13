import {BASEURL, server} from "../main";


server.listen(process.env.PORT || 5000, () => {
    console.log(`TEST Server ${BASEURL} started on port=${process.env.port}, PID=${process.pid}, ${__filename}`)
})
server.emit("request", )