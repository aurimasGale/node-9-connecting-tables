const express = require('express');
const { ObjectId } = require('mongodb');
const { dbClient } = require('../config');
const { getArrayDb } = require('../helper');

const booksRoutes = express.Router();

// routes
// sukursim nauja knyga
booksRoutes.post('/book', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga
    console.log(req.body);
    const newBookObj = req.body;
    const collection = dbClient.db('library').collection('books');
    const insertResult = await collection.insertOne(newBookObj);
    res.status(201).json(insertResult);
  } catch (error) {
    console.error('error in creating a book', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});
booksRoutes.get('/book', async (req, res) => {
  try {
    const booksArr = await getArrayDb('books');
    res.json(booksArr);
  } catch (error) {
    res.status(500).json('Somethig went wrong');
  }
});
// grazina visas knygas
booksRoutes.get('/book-agg2', async (req, res) => {
  const aggPipeLine = [
    {
      $lookup: {
        from: 'authors',
        localField: '_id',
        foreignField: 'bookId',
        as: 'bookAuthorArr',
      },
    },
    {
      $sort: {
        rating: -1,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              $arrayElemAt: ['$bookAuthorArr', 0],
            },
            '$$ROOT',
          ],
        },
      },
    },
    {
      $project: {
        bookAuthorArr: 0,
      },
    },
  ];
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('books');
    const allBooksArr = await collection.aggregate(aggPipeLine).toArray();
    res.status(201).json(allBooksArr);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

booksRoutes.get('/book-authors', async (req, res) => {
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('books');
    const allBooksArr = await collection
      .aggregate([
        {
          $lookup: {
            from: 'authors',
            localField: '_id',
            foreignField: 'bookId',
            as: 'authorArr',
          },
        },
      ])
      .toArray();
    const authorsWithBooksArray = allBooksArr.map((bookObj) => {
      if (bookObj.authorArr.length === 0) {
        return bookObj;
      }
      return {
        title: bookObj.title,
        year: bookObj.year, // jei nera //bookObj.authorArr[0]?.name
        rating: bookObj.rating, // t.y.(undefined), tai jo ir nenaudos (?)
        authorName: bookObj.authorArr[0].name, // bookObj.authorArr[0]?.name
        authorTown: bookObj.authorArr[0].town, // bookObj.authorArr[0]?.town
      };
    });
    console.log('allBooksArr ===', allBooksArr);
    res.status(201).json(authorsWithBooksArray);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// grazina knyga pagal bookId

booksRoutes.get('/book/:bookId', async (req, res) => {
  const { bookId } = req.params;
  console.log(bookId);
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('books');
    const foundBook = await collection.findOne(ObjectId(bookId));
    console.log('foundBook ===', foundBook);
    res.status(201).json(foundBook);
  } catch (error) {
    console.error('error in getting all books', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});

// DELETE book, kurios id === delBookId
booksRoutes.delete('/book/:delBookId', async (req, res) => {
  const { delBookId } = req.params;
  console.log(delBookId);
  try {
    // prisijungti
    await dbClient.connect();
    // atlikti veiksma
    console.log('connected');
    // paimti gautus duomenis ir sukurti nauja knyga

    const collection = dbClient.db('library').collection('comments');
    const deleteResult = await collection.deleteOne({ _id: ObjectId(delBookId) });
    console.log('foundBook ===', deleteResult);
    res.status(200).json(deleteResult);
  } catch (error) {
    console.error('error in deleting specific book', error);
    res.status(500).json('something is wrong');
  } finally {
    // uzdaryti prisijungima
    await dbClient.close();
  }
});
module.exports = booksRoutes;
