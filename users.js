var users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  //   console.log(users);

  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room, amount: 100 };
  users.push(user);

  //   console.log(users);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  //   console.log(users);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  //   console.log("In current users");
  //   console.log(id);
  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => user.room === room);
};

const changeMoney = (user, amount) => {
  users.map(curUser => {
    if (curUser.id === user.id) {
      curUser.amount = curUser.amount + amount;
    }

    return curUser;
  });
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom, changeMoney };
