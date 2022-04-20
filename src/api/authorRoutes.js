const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');

const authorRoutes = express.Router();

authorRoutes.post('/author', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis
    console.log(req.body);
    const newAuthorObj = req.body;
    // eslint-disable-next-line max-len
    // kai gaunam _id string o reikia irasyti ObjectId tipo irasa, paverciam string _id i ObjectId su ObjectId(stringId)
    // !!!!

    newAuthorObj.bookId = ObjectId(newAuthorObj.bookId);
    // console.log(ObjectId(newAuthorObj.bookId));
    // console.log(' newAuthorObj.bookId; ===', ObjectId(newAuthorObj.bookId));
    const collection = dbClient.db('library').collection('authors');
    const insertResult = await collection.insertOne(newAuthorObj);
    res.status(201).json(insertResult);
  } catch (error) {
    console.error('error in creating a book', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

authorRoutes.get('/author', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('authors');
    const allAuthorsArr = await collection.find().toArray();
    res.status(201).json(allAuthorsArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

module.exports = authorRoutes;
