Understanding Websockets Docs (Typed)

lets first understand the Interface of the Websockets:

Behind the scenes web wroker is processing these js files of websockets

The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.

WebSocket is a class containing constructor , properties , methods

WebSocket Api does not provide the feature of backpressure like streams

q what is backpressure ?
a:An important concept in streams is backpressure — this is the process by which a single stream or a pipe chain regulates the speed of reading/writing. When a stream later in the chain is still busy and isn't yet ready to accept more chunks, it sends a signal backwards through the chain to tell earlier transform streams (or the original source) to slow down delivery so that you don't end up with a bottleneck anywhere.

to create the websocket connection we use its constructor WebSocket()
you can create an object using the keyword new
these two constructor types are provided to create a object
url (required) protocols(optional)
URL : The URL of the target WebSocket server to connect to. The URL must use one of the following schemes: ws, wss, http, or https
Protocols : A single string or an array of strings representing the sub-protocol(s) that the client would like to use, in order of preference. If it is omitted, an empty array is used by default, i.e., [].
Sec-WebSocket-Protocol : saop , wamp

new WebSocket(url)
new WebSocket(url, protocols)

If the connection cannot be established (for example, the server is unreachable or the handshake fails), an error event fires and is followed by a close event whose wasClean property is false — so every connection attempt ultimately ends with either an open event or a close event.

```javascript
const socket = new WebSocket("wss://websocket.exampl.org");

socket.close()

//we can handle disconnection in a more good way

socket.addEventListener("close",(event) => {
    if(event.wasClean)
    {
        console.log(`Closed Cleanly, code=${event.code} , reason=${event.reason}`)
    }else
    {
        console.log("Connection Closed was not Clean")
    }
}) 

```

lets Understand about the properties in the WebSocket class

1.WebSocket.binaryType : The WebSocket.binaryType property controls the type of binary data being received over the WebSocket connection.
A string:

"blob"
Use Blob objects for binary data. This is the default value.

"arraybuffer"
Use ArrayBuffer objects for binary data

2. WebSocket.bufferedAmount : The WebSocket.bufferedAmount read-only property returns the number of bytes of data that have been queued using calls to send() but not yet transmitted to the network. This value resets to zero once all queued data has been sent. This value does not reset to zero when the connection is closed; if you keep calling send(), this will continue to climb.

data type : An unsigned long

3. WebSocket.protocol : read-only property returns the name of the sub-protocol the server selected, or the empty string if no connection is established
default value is empty string , it changes only if mentioned explicitly in the object creation

Important
4.WebSocket.readyState : read-only property returns the current state of the WebSocket connection.
the datatype is number having four states 0 , 1 , 2 , 3
    0 : websocket is created but connection not opened
    1 : websocket connection is open ready to communicate
    2 : websocket connection is in the processing of closing
    3 : websocket connection is closed

5. WebSocket.url : returns the url of the WebSocket Connection (this cannot be empty)

Methods

close() : closing webscoket happens with the closing handshake (sending closing frames(like a datapacket) before closing TCP Connection() )
three types of methods (overloading concept)

close() //default value of code : 1000  range : (0 - 4999) you can use custom codes :(1000-1015)
close(code)
close(code, reason)// default reason = ""

input : code and reason
reason Optional
A string providing a custom WebSocket connection close reason (a concise human-readable prose explanation for the closure). The value must be no longer than 123 bytes (encoded in UTF-8).
deaf

send() method : The WebSocket.send() method enqueues the specified data to be transmitted to the server over the WebSocket connection, increasing the value of bufferedAmount by the number of bytes needed to contain the data. If the data can't be sent (for example, because it needs to be buffered but the buffer is full), the socket is closed automatically. The browser will throw an exception if you call send() when the connection is in the CONNECTING state. If you call send() when the connection is in the CLOSING or CLOSED states, the browser will silently discard the data.

it takes only parameter that is data and it can send four types of data 
1. string : socket.send("Hi this is the string")
2. Blob : through this we can send the actual data files like pdf, images, audio ec
3. ArrayBuffer : const buffer = new ArrayBuffer(16); socket.send(buffer) 0 , 1 , very fast compared to normal arrays
4. Dataview or typed Array

bufferedAmount is dcided on the basis of browser RAM for chrome it is usually between 2GB to 4GB

Events

1. close : a close event is fired when the connection with the WebSocket

addEventListener("close" ,() => {})
onclose(event)=>{}

code Read only
Returns an unsigned short containing the close code sent by the server.

reason Read only
Returns a string indicating the reason the server closed the connection. This is specific to the particular server and sub-protocol.

wasClean Read only
Returns a boolean value that Indicates whether or not the connection was cleanly closed.

2. The error event is fired when a connection with a WebSocket has been closed due to an error

    addEventListener("error", (event) => { })
    onerror = (event) => { }

3.message event : The message event is fired when data is received through a WebSocket.

addEventListener("message", (event) => { })
onmessage = (event) => { }

there are two properties: data , origin

data :  data type that was ent by the websocket connection
can be string , blob etc.
origin : A string representing the origin of the message emitter.
lastEventId, source, ports : default values("", null , [])

4.open event : this event is fired when the connection with th websocket connection is opened
addEventListener("open", (event) => { })
onopen = (event) => { }

WebSocket for Client Side Applications

```javascript const wsuri = "ws://127.0.0.1/"
const socket = new WebSocket(wsuri);

WebSocket.addEventListener("open",() => {

    const ping = setInterval(() => {
        console.log(`SENT : ping `)
    } , 1000);
})

```

Listening for errors
websocket.addEventListener("error",(e) => {})

```javascript
// Sending messages
websocket.addEventListener("open", () => {
log("CONNECTED");
pingInterval = setInterval(() => {
    log(`SENT: ping: ${counter}`);
    websocket.send("ping");
}, 1000);
});
const message = {};
JSON.strigify(message);

 //Receiving messages

websocket.addEventListner("message",(e) => {
    console.log(e.data , counter)
});

```

if the server is sending the json string than parse into objects using JSON.parse(e.data);

```javascript
//handling disconnect
websocket.addEventListener("close",()=> {
    log("Disconnected");
    clearInterval(pingInterval);
})

```

working with bfcache(bacl/forward cache)
Different browsers use different criteria for adding a page to the bfcache, and having an open WebSocket connection may prevent the browser adding your page to the bfcache. This means it's good practice to close your connection when the user has finished with your page. The best event to use for this is the pagehide event.

```javascript
window.addEventListener("pagehide",()=>{
    if(websocket)
    {
        console.log("closing");
        websocket.close();
        websocket = null;
        window.clearInterval(pingInterval);
    }
})

```

Conversely, by listening for the pageshow event, you can seamlessly start the connection again when the page is restored from the bfcache.
In the following example, we start the initial connection when the page is first loaded and only reconnect when the page is restored (checking for event.persisted):

```javascript
int Websocket = null; 

function initializeWebsocketListeners(ws)
{
    ws.addEventListener("open",()=>{
        
    })
}

ws.addEventListner("close",()=> {
    console.log("disconnected)l;
})


ws.addEventListener("message",(e)=>{
    console.log(JSON.Parse(e.data));
    //${e.counter}
})

ws.addEventListner("error",(e)=> {
    console.log()
})

ws.addEventListener("pageshow",(event)=> {
    if(event.persisted)
    {
        websocket =  new Websocket();
        initializeWebSocketListeners(websocket);
    }
})


log("OPENING");
websocket = new WebSocket(wsUri);
initializeWebSocketListeners(websocket); 

```

WebSocket for Servers

Lets understand how connection is connected In the websocket server is nothing more than an application listening on any port of a TCP server

first The WebsocketHandshake : use port 80 or 443 for listening ,the handshake is in the Web in WebSockets GET /Chat HTTP/1.1
Host: exmaple.com.8000
Upgrade: websocket
Connection:Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version:13

2. server handshake Response

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection:Upgrade
Sec-Websocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

this sec-websocket-key is converted to sec-websocket-accept header using the complex process

"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"+"dGhlIHNhbXBsZSBub25jZQ==" SHA-1 result => "s3pPLMBiTxaQ9kYGzzhZRbK+xOo="


First byte:
Bit 0 FIN: tells whether this is the last message in a series. If it's 0, then the server keeps listening for more parts of the message; otherwise, the server should consider the message delivered. More on this later.
Bit 1–3 RSV1, RSV2, RSV3: can be ignored, they are for extensions.
Bits 4-7 OPCODE: defines how to interpret the payload data: 0x0 for continuation, 0x1 for text (which is always encoded in UTF-8), 0x2 for binary, and other so-called "control codes"  In this version of WebSockets, 0x3 to 0x7 and 0xB to 0xF have no meaning.
Bit 8 MASK: tells whether the message is encoded. Messages from the client must be masked, so your server must expect this to be 1. (In fact, section 5.1 of the spec says that your server must disconnect from a client if that client sends an unmasked message.) Server-to-client message are not masked and have this bit set to 0. We'll explain masking later, in reading and unmasking the data. Note: You must mask messages even when using a secure socket.
Bits 9–15: payload length. May also include the following 2 bytes or 8 bytes; see Decoding Payload Length.
If masking is used (always true for client-to-server messages), the next 4 bytes contain the masking key; see Reading and unmasking the data.
All subsequent bytes are payload.
Decoding Payload Length
To read the payload data, you must know when to stop reading. That's why the payload length is important to know. Unfortunately, this is somewhat complicated. To read it, follow these steps:

Read bits 9-15 (inclusive) and interpret that as an unsigned integer. If it's 125 or less, then that's the length; you're done. If it's 126, go to step 2. If it's 127, go to step 3.
Read the next 16 bits and interpret those as an unsigned integer. You're done.
Read the next 64 bits and interpret those as an unsigned integer. (The most significant bit must be 0.) You're done.



