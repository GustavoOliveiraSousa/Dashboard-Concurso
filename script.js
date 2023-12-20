window.onload = function () {
    var bookshelf = document.getElementById('bookshelf');
    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(function (book, index) {
        addBookToShelf(book.materia, book.link, index);
    });

    new Sortable(bookshelf, {
        animation: 150,
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
    });
};

document.getElementById('addBookForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var materia = document.getElementById('materia').value;
    var link = document.getElementById('link').value;

    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.push({ materia: materia, link: link });
    localStorage.setItem('books', JSON.stringify(books));

    addBookToShelf(materia, link, books.length - 1);

    document.getElementById('materia').value = '';
    document.getElementById('link').value = '';
});

function addBookToShelf(materia, link, index) {
    var bookshelf = document.getElementById('bookshelf');
    var book = document.createElement('div');
    book.className = 'book';
    book.draggable = true;
    book.id = 'book-' + index;

    var linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank';
    linkElement.textContent = materia;

    var remove = document.createElement('div');
    remove.className = 'remove';
    remove.textContent = 'X';
    remove.addEventListener('click', function (event) {
        event.stopPropagation();
        var shouldDelete = confirm('Você realmente deseja deletar essa matéria?');
        if (shouldDelete) {
            var books = JSON.parse(localStorage.getItem('books'));
            var bookIndex = books.findIndex(function (book) {
                return book.materia === materia && book.link === link;
            });
            if (bookIndex !== -1) {
                books.splice(bookIndex, 1);
                localStorage.setItem('books', JSON.stringify(books));
            }
            bookshelf.removeChild(book);
        }
    });

    book.appendChild(linkElement);
    book.appendChild(remove);
    bookshelf.appendChild(book);
}
