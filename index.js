const io =require("socket.io")(8900, {
    cors:{
            origin: "*",

    }
})
let users = [];
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
// this above functionn makes sure that it doesnt duplicate/ put multipe entries of
//  the socket id for the same user.
io.on("connection", (socket)=>
{
    console.log("a user connected")
// io.emit("welcome", "this is emitted message inside the server.")
// take event from client - on

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);


  });
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  

//  when a user logs out or moves to another page,
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
    // updates the users list by removing the user with the socket id that disconnected
  });
});
  


