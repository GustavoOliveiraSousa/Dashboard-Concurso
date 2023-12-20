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

function addBookToShelf(materia, link, index) {
    var bookshelf = document.getElementById('bookshelf');
    var book = document.createElement('a');
    book.href = link;
    book.target = '_blank';
    book.className = 'book';
    book.textContent = materia;
    var remove = document.createElement('div');
    remove.className = 'remove';
    remove.textContent = 'X';
    remove.addEventListener('click', function (event) {
        event.stopPropagation();
        bookshelf.removeChild(book);
        var books = JSON.parse(localStorage.getItem('books'));
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
    });
    book.appendChild(remove);
    bookshelf.appendChild(book);
}