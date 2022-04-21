const BASE_URL = 'http://localhost:3001/api/';
console.log('front js');

const listEl = document.getElementById('books');

function makeBooksList(booksArr) {
  listEl.innerHTML = booksArr
    .map((bObj) => `<li>${bObj.title}, ${bObj.year} <strong>${bObj.authorName}</strong> </li>`)
    .join('');
}
async function getBooks(resource) {
  const resp = await fetch(`${BASE_URL}/${resource}`);
  const atsInJs = await resp.json();
  console.log('atsInJs ===', atsInJs);
  makeBooksList(atsInJs);
}
getBooks('book-authors');
