const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/snippet-app", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connection successful");

    const User = require('./models/User');
    const Snippet = require('./models/Snippet');
    
    const authenticateJWT = (req, res, next) => {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
    
      jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
        req.user = user;
        next();
      });
    };
    
    app.post('/api/login', async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(password, user.password, !bcrypt.compareSync(password, user.password));

      if (!user) {// || !bcrypt.compareSync(password, user.password)
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    
      const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret);
      res.json({ token });
    });
    
    app.get('/api/snippets', authenticateJWT, async (req, res) => {
      const snippets = await Snippet.find();
      res.json(snippets);
    });
    
    app.post('/api/snippets', authenticateJWT, async (req, res) => {
      const { code, preview } = req.body;
      const newSnippet = new Snippet({ code, preview });
      await newSnippet.save();
      res.json(newSnippet);
    });
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

