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

    //lets Understand about the properties in the WebSocket class

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

    //Important
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
    // sending messages
    websocket.addEventListener("open", () => {
    log("CONNECTED");
    pingInterval = setInterval(() => {
        log(`SENT: ping: ${counter}`);
        websocket.send("ping");
    }, 1000);
    });
    const message = {};
    JSON.strigify(message);

    // receiving messages

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




