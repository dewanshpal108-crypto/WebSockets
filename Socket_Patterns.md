If  we come to the part of the production level for the Websockets proper structuring of the payload is important so below there are some patterns that should be applied 

1. Envelope Pattern : we do not send the raw message in the production , we send contextual meaning or intent with it ,example of the Envelope Pattern

```javascript
{
    type:"Chat_Message",
    id:"uuid-123",
    payload :{text:"Hi" , roomId:"general"},
    metadata:{sentAt:1705622400}
}

//based on the type you can switch
switch(msg.type){ 
    case 'Chat_Message':
    return handleChatMessage(msg.payload)
    case 'Join_Room':
    return handleJoinRoom(msg.payload)
}

```
now there are two ways to structure the envelopes one is type based (chat kind of applications)commands and other is topic based (pub sub kind of applications )commands

after selecting the valid structure of the envelope select the format of the data , text(JSON) or Blob(binary)

now  we have to move from message structure form message routing to design the appropriate routing flow as per the requirement of the application

Bradcast(to everyone) , unicast(sending private messages to a user using its userid) , multicast(sending to particular room of users)

relaiblity in websockets is confirmed using the ACK received by the client for each messageId

2. Pub/Sub Pattern:
we need to use the redis as the shared brain because servers dont share states

```
[UserA]    [UserB]   [UserC]    [UserD]
   |          |         |          |
   |          |         |          |
   |          |         |          |
    [Server1]--X-------X--[Server2]
        |                     |
        |                     |
        |                     |
        |  _________________  |
        | |  Message Broker | |
        \-|   Shared Brain  |-/
          |_____ REDIS _____|

```
           