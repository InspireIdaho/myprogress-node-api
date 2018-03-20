require('./config/config');

const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser  = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Progress} = require('./models/progress');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
  res.send('<h1>Hello InspireIdahoans!</h1>')
});

// create single progress
app.post('/progress', authenticate, (req, res) => {
  var progress = new Progress({
    completedOn: req.body.completedOn,
    indexPath : req.body.indexPath,
    _creator: req.user._id
  });

  progress.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    //console.log("could not save to DB")
    res.status(400).send(e);
  });
});

// get all progress objs for user
app.get('/progress', authenticate, (req, res) => {
  Progress.find({_creator: req.user._id}).then((progress) => {
//Progress.find().then((progress) => {
    res.send({progress});
  }, (e) => {
    res.status(400).send(e);
  });

});

// delete a progress obj by ID
app.delete('/progress/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  console.log('deleting: ' + id);

  if(!ObjectID.isValid(id)) {
    res.status(404).send('Malformed ID');
    return;
  }

  try {
    const progress = await Progress.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (progress) {
      res.send({_id: progress._id});
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.status(400).send();
  }
});

// update an existing progress obj
// only property that makes sense to update is completedOn

app.patch('/progress/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['completedOn']);

  if(!ObjectID.isValid(id)) {
    res.status(404).send('Malformed ID');
    return;
  }

  Progress.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((progress) => {
    if (!progress) {
      res.status(404).send();
      return;
    }
    res.send({_id: progress._id});
  }).catch((e) => {
    res.status(400).send(e)
  });

});


// post /users
// use pick, so no new fields
app.post('/users', async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);
  // same as following, no need to create new obj that is same
  // var user = new User({
  //   email: req.body.email,
  //   password: req.body.password
  // });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.post('/users/login', async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }




  // User.findByCredentials(email, password).then((user) => {
  //   return user.generateAuthToken().then((token) => {
  //     res.header('x-auth', token).send(user);
  //   });
  // }).catch((e) => {
  //   res.status(400).send();
  // });
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});



// start server loop
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});

module.exports = {app};
