const WebSocket = require("ws");

const socket  = new WebSocket("ws://localhost:80");

socket.addEventListener("open",(e)=>{
    console.log(`connected ${socket.readyState}`);
    const data = {Ownername:"Dewansh" , id:"1234"}
    socket.send(JSON.stringify(data));
})

socket.addEventListener("message", (event) => {
    const data = event.data;
    try {
        const message = JSON.parse(data);
        console.log("Client Received:",message);
    } catch (error) {
        console.log("Client catch Received:", data);
    }
});

socket.addEventListener("close",(e)=>{
    console.log(`closed ${e.wasClean}`)
})

socket.on("error",(e)=>{
    console.log(e);
})