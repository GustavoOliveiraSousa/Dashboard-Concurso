window.onload = function () {
    var bookshelf = document.getElementById('bookshelf');
    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(function (book, index) {
        addBookToShelf(book.materia, book.link, index, book.completed);
    });

    new Sortable(bookshelf, {
        animation: 150,
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        onEnd: function () {
            var books = Array.from(bookshelf.children).map(function (bookElement) {
                return {
                    materia: bookElement.querySelector('a').textContent,
                    link: bookElement.querySelector('a').href,
                    completed: bookElement.classList.contains('completed')
                };
            });
            localStorage.setItem('books', JSON.stringify(books));
        }
    });

    // Atualizar visibilidade dos botões
    updateButtonVisibility();
};

document.getElementById('addBookForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var materia = document.getElementById('materia').value;
    var link = document.getElementById('link').value;

    var books = JSON.parse(localStorage.getItem('books')) || [];
    books.push({ materia: materia, link: link, completed: false });
    localStorage.setItem('books', JSON.stringify(books));

    addBookToShelf(materia, link, books.length - 1, false);

    document.getElementById('materia').value = '';
    document.getElementById('link').value = '';
});

function addBookToShelf(materia, link, index, completed) {
    var bookshelf = document.getElementById('bookshelf');
    var book = document.createElement('div');
    book.className = 'book';
    book.style.backgroundColor = colorMap[materia.charAt(0).toLowerCase()] || '#FFFFFF';
    book.draggable = true;
    book.id = 'book-' + index;

    if (completed) {
        book.classList.add('completed');
    }

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

    var edit = document.createElement('div');
    edit.className = 'edit';
    edit.textContent = 'Editar';
    edit.addEventListener('click', function (event) {
        event.stopPropagation();
        var newMateria = prompt('Digite o novo nome da matéria:', materia);
        var newLink = prompt('Digite o novo link:', link);
        if (newMateria !== null && newLink !== null) {
            var books = JSON.parse(localStorage.getItem('books'));
            var bookIndex = books.findIndex(function (book) {
                return book.materia === materia && book.link === link;
            });
            if (bookIndex !== -1) {
                books[bookIndex] = { materia: newMateria, link: newLink, completed: books[bookIndex].completed };
                localStorage.setItem('books', JSON.stringify(books));
                bookshelf.removeChild(book);
                addBookToShelf(newMateria, newLink, bookIndex, books[bookIndex].completed);
            }
        }
    });

    var complete = document.createElement('button');
    complete.className = 'complete';
    complete.textContent = 'Concluir';
    complete.addEventListener('click', function (event) {
        event.stopPropagation();
        book.classList.toggle('completed');
        var completed = book.classList.contains('completed');
        var books = JSON.parse(localStorage.getItem('books'));
        books[index].completed = completed;
        localStorage.setItem('books', JSON.stringify(books));
    });

    book.appendChild(linkElement);
    book.appendChild(remove);
    book.appendChild(edit);
    book.appendChild(complete);
    bookshelf.appendChild(book);

    // Atualizar visibilidade dos botões
    updateButtonVisibility();
}


document.getElementById('export').addEventListener('click', function () {
    var books = localStorage.getItem('books');
    var a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(books);
    a.download = 'books.json';
    a.click();
});

document.getElementById('import').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function (event) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var books = JSON.parse(event.target.result);
            localStorage.setItem('books', JSON.stringify(books));
            location.reload(); // Recarrega a página
        };
        reader.readAsText(event.target.files[0]);
    };
    input.click();
});

document.getElementById('searchInput').addEventListener('input', function (event) {
    var searchText = event.target.value;
    searchMateria(searchText);
});

function searchMateria(searchText) {
    var books = JSON.parse(localStorage.getItem('books')) || [];
    var filteredBooks = books.filter(function (book) {
        return book.materia.toLowerCase().includes(searchText.toLowerCase());
    });

    document.getElementById('bookshelf').innerHTML = '';

    filteredBooks.forEach(function (book, index) {
        addBookToShelf(book.materia, book.link, index, book.completed);
    });
}

var colorMap = {
    'a': '#FFADAD',
    'b': '#FFD6A5',
    'c': '#FDFFB6',
    'd': '#CAFFBF',
    'e': '#9BF6FF',
    'f': '#A0C4FF',
    'g': '#BDB2FF',
    'h': '#FFC6FF',
    'i': '#FFFFFC',
    'j': '#E5989B',
    'k': '#6D6875',
    'l': '#D9A5B3',
    'm': '#BC6C25',
    'n': '#D64161',
    'o': '#FF7F50',
    'p': '#B39C8D',
    'q': '#218380',
    'r': '#6D597A',
    's': '#FFA500',
    't': '#BFD7EA',
    'u': '#6A057F',
    'v': '#FFD700',
    'w': '#9E2A2B',
    'x': '#540B0E',
    'y': '#D3F8E2',
    'z': '#E4C1F9'
};

function updateButtonVisibility() {
    var books = document.querySelectorAll('.book');
    books.forEach(function (book) {
        book.addEventListener('mouseover', function () {
            this.querySelector('.remove').style.display = 'block';
            this.querySelector('.edit').style.display = 'block';
        });
        book.addEventListener('mouseout', function () {
            this.querySelector('.remove').style.display = 'none';
            this.querySelector('.edit').style.display = 'none';
        });
    });
}
