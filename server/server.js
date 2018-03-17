const express = require('express');

const port = process.env.PORT || 3000;
var app = express();

// routes
app.get('/', (req, res) => {
  res.send('<h1>Hello from Express!</h1>')
});


app.get('/login', (req, res) => {

});




// start server loop
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
