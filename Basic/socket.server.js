const WebSocket = require("ws");

const wss = new WebSocket.Server({port:80})

console.log("Websocket server is running ");

// const interval1=setInterval(()=>{
//     console.log("running ..")
// },1000)


// setTimeout(()=>{
//     clearInterval(interval1);
//     console.log("Websocket server closed after 10 sec")
// }, 10000)

wss.on("connection",(socket)=>{
    console.log("client connected");
    socket.send("connected to the Websocket Server")

    socket.on("message", (message) => {
        const data = JSON.parse(message)
    console.log("Server Received:", data);
    // Send back to same client
    socket.send(JSON.stringify(data));
    });

    socket.on("close", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (err) => {
        console.log(err);
    })
})





