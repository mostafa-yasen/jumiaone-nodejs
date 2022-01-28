
window.addEventListener('DOMContentLoaded', (event) => {
    async function search(q, sortBy, order) {
        let result = await fetch(`/api/v1/search?q=${q}&sort_by=${sortBy}&order=${order}`)
            .then(response => response.json());
        console.log(result);

        return result;
    }

    let searchBtn = document.getElementById("searchBtn");
    let searchBar = document.getElementById("searchBar");
    let sortByInput = document.getElementById("sortByInput");
    let orderRadios = document.getElementsByName("order");
    let resultsHTML = document.getElementById('results');

    function renderBook(book) {
        let bookCard = document.createElement('div');
        bookCard.classList.add('card');
        bookCard.classList.add('mb-4');

        let cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header')

        let bookImage = document.createElement('img')
        bookImage.src = book.best_book[0].image_url
        cardHeader.appendChild(bookImage);
        bookCard.appendChild(cardHeader);

        let bookCardBody = document.createElement('div');
        bookCardBody.classList.add("card-body");

        let bookName = document.createElement('h3');
        bookName.innerText = book.best_book[0].title[0]
        bookCardBody.appendChild(bookName);

        let bookAuther = document.createElement('div');
        bookAuther.innerText = `by: ${book.best_book[0].author[0].name[0]}`
        bookCardBody.appendChild(bookAuther);

        let bookRate = document.createElement('div')
        bookRate.innerText = `rate: ${book.average_rating[0]}`
        bookCardBody.appendChild(bookRate);
        bookCard.appendChild(bookCardBody);

        return bookCard;
    }

    async function searchWrapper() {
        console.log("search wrapper")
        let q = searchBar.value || 'random'
        let sortBy = sortByInput.value
        let order = Array.from(orderRadios).find(radio => radio.checked).value;

        let result = await search(q, sortBy, order);

        resultsHTML.innerHTML = "";
        for (let book of result.response[0].results[0].work.slice(0, 10)) {
            let bookHTML = renderBook(book);
            resultsHTML.appendChild(bookHTML);
        }
    }

    searchWrapper();
    searchBtn.addEventListener('click', searchWrapper);

});
