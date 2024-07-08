const express = require("express");
const jwt = require('jsonwebtoken');
const config = require('config');
const app = express();
const {Server} = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();
require('./startup/db')();
require('./startup/routes')(app);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});


const io = new Server(server);

const connectedUsers = {};
const {User} = require("./models/user");
const {Group} = require('./models/group');
const crypto = require('crypto');

io.use(async (socket, next) => {
  const token = socket.handshake.headers.auth;
  if (!token) {
    return next(new Error('Authentication error: Token not found'));
  }
  jwt.verify(token, config.get('jwtPrivateKey'), async (err, user) => {
    if (err) {
        console.log('no')
    }
    socket.user = user;
    next();

  });
});
io.on('connection', async function(socket) {
  console.log('A user connected:', socket.user);
  connectedUsers[socket.user.id] = socket.id

  socket.on('message', async function (receiverId, message, privateKey) {
    const user = await User.findByPk(Number(receiverId));
    const receiverSocketId = connectedUsers[receiverId];

    if (receiverSocketId) {
      const encryptedMessage = crypto.publicEncrypt(user.publicKey, Buffer.from(message));
      const signature = crypto.sign("sha256", encryptedMessage, privateKey);
  
      const messageToSend = {
        senderId: socket.user.id,
        encryptedMessage: encryptedMessage,
        signature: signature.toString('base64')
      }
      io.to(receiverSocketId).emit('receiveMessage', messageToSend);
    } else {
      socket.emit('userOffline', { receiverId });
    }
  });
  socket.on('groupMessage', async function (groupId, message, privateKey) {
    const group = await Group.findByPk(Number(groupId));

    if(group){
      let users = await group.getUsers();

      for(let user of users){
        if (connectedUsers[user.id] && user.id != socket.user.id) {

          const encryptedMessage = crypto.publicEncrypt(user.publicKey, Buffer.from(message));
          const signature = crypto.sign("sha256", encryptedMessage, privateKey);
      
          const messageToSend = {
            senderId: socket.user.id,
            encryptedMessage: encryptedMessage,
            signature: signature.toString('base64')
          }

          io.to(connectedUsers[user.id]).emit('receiveMessage', messageToSend);
        }// else {
        //   socket.emit('userOffline', { user.id });
        // }
      }
    }
    
    
  });
  socket.on('disconnect', async function(){
    for (let userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
    console.log('A user disconnected:', socket.id);
  });
});

