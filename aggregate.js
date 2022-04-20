/**
 * from: The target collection. (su kokia lentele jungsim)
 * localField: The local join field.  (vietinis laukas, kuris yra vienodas su kitos lenteles lauku)
 * foreignField: The target join field.  (kitps lenteles laukas lygus localField)
 * as: The name for the results.
 * pipeline: The pipeline to run on the joined collection.
 * let: Optional variables to use in the pipeline field stages.
 */
 {
    from: 'authors',
    localField: '_id',
    foreignField: 'string',
    as: 'author'
  }


  const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$lookup': {
      'from': 'authors', 
      'localField': '_id', 
      'foreignField': 'bookId', 
      'as': 'author'
    }
  }
];

MongoClient.connect(
  'mongodb+srv://aurimas_gale:867626124a@cao-first.7tfxf.mongodb.net/library?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db('library').collection('books');
    coll.aggregate(agg, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  });