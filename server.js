const express = require('express');
const connectDB = require('./Config/db');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

/*** Initialize Middleware ***/
app.use(express.json({ extended: false }));

/*** Connect Database ***/
connectDB();

/*** Define Route ***/
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/users', require('./Routes/users'));
app.use('/api/contacts', require('./Routes/contacts'));

/*** Server static assests in production ***/
if (process.env.NODE_ENV === 'production') {
  
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
