// Carregar livros do localStorage ao carregar a página
window.onload = function () {
    var bookshelf = document.getElementById('bookshelf');
    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(function (book, index) {
        addBookToShelf(book.materia, book.link, index);
    });
};

// Adicionar novo livro ao enviar o formulário
document.getElementById('addBookForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var materia = document.getElementById('materia').value;
    var link = document.getElementById('link').value;

    // Salvar novo livro no localStorage
    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.push({ materia: materia, link: link });
    localStorage.setItem('books', JSON.stringify(books));

    addBookToShelf(materia, link, books.length - 1);
});

function addBookToShelf(materia, link) {
    var bookshelf = document.getElementById('bookshelf');
    var book = document.createElement('div');
    book.className = 'book';
    var linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank';
    linkElement.textContent = materia;
    var remove = document.createElement('div');
    remove.className = 'remove';
    remove.textContent = 'X';
    remove.addEventListener('click', function (event) {
        event.stopPropagation();
        var books = JSON.parse(localStorage.getItem('books'));
        var bookIndex = books.findIndex(function (book) {
            return book.materia === materia && book.link === link;
        });
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            localStorage.setItem('books', JSON.stringify(books));
        }
        bookshelf.removeChild(book);
    });
    book.appendChild(linkElement);
    book.appendChild(remove);
    bookshelf.appendChild(book);
}


