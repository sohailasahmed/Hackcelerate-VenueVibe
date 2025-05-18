import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'mock', 'users.json');

const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const writeUsers = (data) => fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));

// Signup logic
export const signup = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ username, password });
  writeUsers(users);

  res.status(201).json({ message: 'Signup successful' });
};

// Login logic
export const login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful', username });
};
