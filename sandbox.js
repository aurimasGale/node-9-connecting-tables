const obj1 = {
  _id: '625f46310b760b9fccd0f252',
  title: 'book 1',
  year: 2000,
  rating: 4,
  authorArr: [
    {
      _id: '625f5ce18ffa304f1b131d54',
      name: 'James book1',
      town: 'London',
      bookId: '625f46310b760b9fccd0f252',
    },
  ],
};

// obj1.authorName = obj1.authorArr[0].name;
// obj1.authorTown = obj1.authorArr[0].town;
// delete obj1.authorArr;

const objCopy = {
  title: obj1.title,
  year: obj1.year,
  rating: obj1.rating,
  authorName: obj1.authorArr[0].name,
  authorTown: obj1.authorArr[0].town,
};

console.log('obj1 ===', obj1);
console.log('objCopy ===', objCopy);

const obj2 = {
  _id: '625f46310b760b9fccd0f252',
  title: 'book 1',
  year: 2000,
  rating: 4,
  name: 'James book1',
  town: 'London',
};
