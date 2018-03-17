const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ProgressApp', (err, db) => {
  if (err) {
    return console.log('Could not connect to MongoDB server');
  }
  console.log('Connected to MongoDB');

  db.collection('ProgressNodes').insertOne({
    completedOn : 542572664,
    indexPath : { indexes : [1,1,0] }
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.close();
});
