/* eslint-disable comma-dangle */
const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');
const { getArrayDb } = require('../helper');

const authorRoutes = express.Router();
// routes
// post author
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
// get author
authorRoutes.get('/author', async (req, res) => {
  const authorArr = await getArrayDb('authors');
  if (authorArr === false) {
    res.status(500).json('Somethig went wrong');
    return;
  }
  res.json(authorArr);
});

// get specific author by name
authorRoutes.get('/author/:author', async (req, res) => {
  const name = req.params.author;
  console.log(name);
  try {
    await dbClient.connect();
    console.log('connected');

    const collection = dbClient.db('library').collection('authors');
    const allAuthorsArr = await collection.find({ name }).toArray();
    res.status(201).json(allAuthorsArr);
  } catch (error) {
    console.error('error in getting specific author', error);
    res.status(500).json('something is wrong');
  } finally {
    await dbClient.close();
  }
});

// PATCH /api/author/:authorId - atnaujingti varda
authorRoutes.patch('/author/:authorId', async (req, res) => {
  // updateOne({filterObj/query}, {$set:{name:"James"}})
  const { authorId } = req.params;
  const { newName } = req.body;
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('authors');
    const updateResult = await collection.updateOne(
      { _id: ObjectId(authorId) },
      { $set: { name: newName } }
    );
    res.status(201).json(updateResult);
  } catch (error) {
    console.error('error in updating authors name', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// eslint-disable-next-line max-len
// PATCH /api/author/add-book/:authorId - prideda viena knyga , kurios id === authorId i bookId masyva
authorRoutes.patch('/author/add-book/:authorId', async (req, res) => {
  // updateOne({filterObj/query}, {$set:{name:"James"}})
  const { authorId } = req.params;
  const { newName } = req.body;
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('authors');
    const updateResult = await collection.updateOne(
      { _id: ObjectId(authorId) },
      { $set: { name: newName } }
    );
    res.status(201).json(updateResult);
  } catch (error) {
    console.error('error in updating authors name', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});
module.exports = authorRoutes;
