const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({msg: 'Welcome to the ContactKeeper API...'});
});

/*** Define Route ***/ 
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/users', require('./Routes/users'));
app.use('/api/contacts', require('./Routes/contacts'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
