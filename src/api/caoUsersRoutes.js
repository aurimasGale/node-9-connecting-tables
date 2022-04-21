const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');

const caoUsersRoutes = express.Router();

caoUsersRoutes.get('/cao-users', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('cao-10').collection('users');
    const caoUsersArr = await collection.find().toArray();
    res.status(200).json(caoUsersArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

caoUsersRoutes.post('/cao-users', async (req, res) => {
  try {
    await dbClient.connect();
    console.log('connected');
    console.log(req.body);
    const newCaoUser = req.body;

    const collection = dbClient.db('cao-10').collection('users');
    const insertResult = await collection.insertOne(newCaoUser);
    res.status(201).json(insertResult);
  } catch (error) {
    console.error('error in creating a book', error);
    res.status(500).json('something is wrong');
  } finally {
    await dbClient.close();
  }
});

caoUsersRoutes.delete('/cao-users/:delUserId', async (req, res) => {
  const { delUserId } = req.params;
  console.log(delUserId);
  try {
    await dbClient.connect();
    console.log('connected');

    const collection = dbClient.db('cao-10').collection('users');
    const deleteResult = await collection.deleteOne({ _id: ObjectId(delUserId) });
    console.log('foundBook ===', deleteResult);
    res.status(200).json(deleteResult);
  } catch (error) {
    console.error('error in deleting specific book', error);
    res.status(500).json('something is wrong');
  } finally {
    await dbClient.close();
  }
});

caoUsersRoutes.get('/cao-comments', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('cao-10').collection('comments');
    const caoUsersArr = await collection.find().toArray();
    res.status(200).json(caoUsersArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

caoUsersRoutes.get('/cao-comments/comments', async (req, res) => {
  try {
    await dbClient.connect();
    console.log('connected');

    const collection = dbClient.db('cao-10').collection('comments');
    const insertResult = await collection
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
      ])
      .toArray();
    const newArr = insertResult.map((bookObj) => {
      if (bookObj.user.length === 0) {
        return bookObj;
      }
      return {
        date: bookObj.date,
        comment: bookObj.comment,
        user: bookObj.user[0].name,
      };
    });

    res.status(201).json(newArr);
  } catch (error) {
    console.error('error in creating a book', error);
    res.status(500).json('something is wrong');
  } finally {
    await dbClient.close();
  }
});

module.exports = caoUsersRoutes;
