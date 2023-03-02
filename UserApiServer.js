const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/users', (req, res) => {
  const data = fs.readFileSync('./userdata/data.json');
  const users = JSON.parse(data);
  res.json(users);
});

app.post('/users', (req, res) => {
  const data = fs.readFileSync('./userdata/data.json');
  const users = JSON.parse(data);

  const newUser = req.body;
  newUser.id = users.length + 1;
  newUser.createdOn = new Date();

  users.push(newUser);
  fs.writeFileSync('./userdata/data.json', JSON.stringify(users));

  res.json(newUser);
});

app.put('/users/:id', (req, res) => {
  const data = fs.readFileSync('./userdata/data.json');
  const users = JSON.parse(data);

  const id = parseInt(req.params.id);
  const updatedUser = req.body;

  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    updatedUser.id = id;
    updatedUser.modifiedOn = new Date();
    users[index] = updatedUser;
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const data = fs.readFileSync('./users.json');
  const users = JSON.parse(data);

  const id = parseInt(req.params.id);

  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
