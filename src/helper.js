const { dbClient } = require('./config');

async function getArrayDb(collectionName) {
  try {
    //   prisijungti
    await dbClient.connect();
    // gauti masyva
    const collection = dbClient.db('library').collection(collectionName);
    const arrFromDb = await collection.find().toArray();

    return arrFromDb;
  } catch (error) {
    console.error('error in getArrayDb', error);
    // return false;
    throw new Error('error in GetArrayDb');
  } finally {
    await dbClient.close();
  }
}

function getSingleDb() {}

module.exports = {
  getArrayDb,
};
