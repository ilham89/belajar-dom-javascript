const UNFINISHED_READ_LIST_BOOKS_ID = "incompleteBookshelfList";
const FINISHED_READ_LIST_BOOKS_ID = "completeBookshelfList"; 
const BOOKS_ITEMID = "itemId";

/*
    function for data books
*/
function makeBook(bookName, author, year, isFinishRead) {
 
    const textBookName = document.createElement("h3");
    textBookName.classList.add("text-book-name");
    textBookName.innerText = bookName;

    const rowAuthor = document.createElement("tr");
    const headAuthor = document.createElement("th");
    const textAuthor = document.createElement("td");
    textAuthor.classList.add("text-author")
    headAuthor.innerText = "Penulis";
    textAuthor.innerText = author;
    rowAuthor.append(headAuthor, textAuthor);
    rowAuthor.append(textAuthor)

    const rowYear = document.createElement("tr");
    const headYear = document.createElement("th");
    const textYear = document.createElement("td");
    textYear.classList.add("text-year")
    headYear.innerText = "Tahun";
    textYear.innerText = year;
    rowYear.append(headYear, textYear);

    const tableDetail = document.createElement("table");
    tableDetail.append(rowAuthor, rowYear)

    const buttonContainer = document.createElement("div")
    buttonContainer.classList.add("action")
    if(isFinishRead){
        buttonContainer.append(
            createEditButton(),
            createUndoButton(),
            createTrashButton()
            );
    } else {
        buttonContainer.append(
            createEditButton(),
            createCheckButton(),
            createTrashButton()
            );
    }

    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book-item", "card")
    bookContainer.append(textBookName, tableDetail, buttonContainer);
 
    return bookContainer;
}

function addBook() {
    const bookName = document.getElementById("inputBookTitle").value;
    const year = document.getElementById("inputBookAuthor").value;
    const author = document.getElementById("inputBookYear").value;
    const isFinishedRead = document.getElementById("inputBookIsComplete").checked;
 
    const book = makeBook(bookName, year, author, isFinishedRead);
    const bookObject = composeBookObject(bookName, year, author, isFinishedRead);
  
    book[BOOKS_ITEMID] = bookObject.id;
    books.unshift(bookObject);
    
    if (isFinishedRead) {
        const finishedReadBookList = document.getElementById(FINISHED_READ_LIST_BOOKS_ID);
        finishedReadBookList.prepend(book);
    } else {
        const unfinishedReadBookList = document.getElementById(UNFINISHED_READ_LIST_BOOKS_ID);
        unfinishedReadBookList.prepend(book);
    }
    updateDataToStorage();
}

function addBookToFinishedRead(bookElement) {
    const finishedReadBookList = document.getElementById(FINISHED_READ_LIST_BOOKS_ID);
    const textBookName = bookElement.getElementsByClassName("text-book-name")[0].innerText;
    const textAuthor = bookElement.getElementsByClassName("text-author")[0].innerText;
    const textYear = bookElement.getElementsByClassName("text-year")[0].innerText;
 
    const newBook = makeBook(textBookName, textAuthor, textYear, true);

    const book = findBookById(bookElement[BOOKS_ITEMID]);
    book.isComplete = true;
    newBook[BOOKS_ITEMID] = book.id;

    finishedReadBookList.prepend(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function undoBookFromFinishedRead(bookElement){
    const unfinishedReadBookList = document.getElementById(UNFINISHED_READ_LIST_BOOKS_ID);
    const textBookName = bookElement.getElementsByClassName("text-book-name")[0].innerText;
    const textAuthor = bookElement.getElementsByClassName("text-author")[0].innerText;
    const textYear = bookElement.getElementsByClassName("text-year")[0].innerText;

    const book = findBookById(bookElement[BOOKS_ITEMID]);
    book.isComplete = false;
 
    const newBook = makeBook(textBookName, textAuthor, textYear, false);
    
    
    newBook[BOOKS_ITEMID] = book.id;
    
    unfinishedReadBookList.prepend(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBook(bookElement) {
    const bookPosition = findBookIndexById(bookElement[BOOKS_ITEMID]);
    books.splice(bookPosition, 1);
    
    bookElement.remove();
    updateDataToStorage();
}

function editBook(bookElement) {
    const bookNameElement = bookElement.getElementsByClassName("text-book-name")[0];
    const authorElement = bookElement.getElementsByClassName("text-author")[0];
    const yearElement = bookElement.getElementsByClassName("text-year")[0];
    const newBookName = prompt("Edit judul buku", bookNameElement.innerText);
    const newAuthor = prompt("Edit penulis buku", authorElement.innerText);
    const newYear = prompt("Edit tahun terbit buku", yearElement.innerText);
    
    if(newBookName != null) bookNameElement.innerText = newBookName;
    if(newAuthor != null) authorElement.innerText = newAuthor;

    if(newYear != null) {
        if(!isNaN(parseInt(newYear))) {
            yearElement.innerText = newYear;
        } else {
            alert("Tahun harus berupa angka! Tahun gagal diedit");
        }
    } 
    
    const book = findBookById(bookElement[BOOKS_ITEMID]);
    book.title = bookNameElement.innerText;
    book.author = authorElement.innerText;
    book.year = yearElement.innerText;

    const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
    newBook[BOOKS_ITEMID] = book.id;

    updateDataToStorage();
}


/*
    function for button item books
*/
function createButton(buttonTypeClass , eventListener) {
    const button = document.createElement("button");
    const icon = document.createElement("i");
    icon.classList.add(buttonTypeClass);
    button.append(icon);
    icon.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function createUndoButton() {
    return createButton("undo-button", function(event){
        const bookElement = event.target.parentElement.parentElement.parentElement;
        undoBookFromFinishedRead(bookElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function(event){
         try {
            const bookElement = event.target.parentElement.parentElement.parentElement;
            addBookToFinishedRead(bookElement);
         } catch {
             alert("Buku gagal dimasukan ke dalam kategori yang telah selesai dibaca")
         }
    });
}

function createTrashButton() {
    return createButton("trash-button", function(event){
        const bookElement = event.target.parentElement.parentElement.parentElement;
        const bookName = bookElement.getElementsByTagName("h3")[0].innerText;
        const deleteWarningMessage = "Apakah kamu yakin untuk menghapus buku " + bookName + "?\nBuku akan dihapus secara permanen.";
        const isBookRemoved = confirm(deleteWarningMessage);
        if(isBookRemoved) removeBook(bookElement);
    });
}

function createEditButton() {
    return createButton("edit-button", function(event){
        const bookElement = event.target.parentElement.parentElement.parentElement;
        editBook(bookElement);
    });
}

/*
    function for action
*/
function showBackgroundTemp(cond) {
    const bgTemp = document.getElementsByClassName("bg-temp")[0];

    if(cond) {
        bgTemp.style.display = "block";
    } else {
        bgTemp.style.display = "none";
    }
}

function showInputBookForm(cond) {
    const inputSection = document.getElementsByClassName("input-container")[0];
    showBackgroundTemp(cond)

    if (cond) {
        inputSection.style.display = "block";
    } else {
        inputSection.style.display = "none";
    }
}

function showSearchBookForm(cond) {
    const searchSection = document.getElementById("searchBook");

    if (cond) {
        searchSection.style.display = "flex";
    } else {
        searchSection.style.display = "none";
    }
}

function tellIfBookEmpty(bookElement) {
    if(!bookElement.getElementsByClassName("book-item").length) {
        if(!bookElement.getElementsByClassName("empty-book-info").length) {
            const emptyMessage = document.createElement("div");
            emptyMessage.classList.add("empty-book-info", "card");
            emptyMessage.innerText = "Data buku kosong!";
            bookElement.append(emptyMessage);
        }
    } else {
        try {
            const emptyMessage = document.getElementsByClassName("empty-book-info")[0];
            bookElement.removeChild(emptyMessage)
        } catch {
            console.log("empty-book-info memang tidak ada");
        }
    }
}

function showBooksSearched(cond) {
    const finishedReadBookList = document.getElementById(FINISHED_READ_LIST_BOOKS_ID);
    const unfinishedReadBookList = document.getElementById(UNFINISHED_READ_LIST_BOOKS_ID);
    const searchedTitle = document.getElementById("searchBookTitle").value;

    function showBookThatSearched(book, regex) {
        const bookName = book.getElementsByClassName("text-book-name")[0].innerText;
        if(regex.test(bookName)) {
            book.style.display="flex";
        } else {
            book.style.display="none";
        }
    }

    if (cond) {
        const re = new RegExp(searchedTitle);
        for(let i = 0; i < finishedReadBookList.children.length; i++) {
            const book = finishedReadBookList.children[i];
            showBookThatSearched(book, re);
        }
        for(let i = 0; i < unfinishedReadBookList.children.length; i++) {
            const book = unfinishedReadBookList.children[i];
            showBookThatSearched(book, re);
        }
    } else {
        for(let i = 0; i < finishedReadBookList.children.length; i++) {
            const book = finishedReadBookList.children[i];
            book.style.display = "flex";
        }
        for(let i = 0; i < unfinishedReadBookList.children.length; i++) {
            const book = unfinishedReadBookList.children[i];
            book.style.display = "flex";
        }
    }
}

function mobileMode(widthDevice) {
    const bookShelf = document.getElementsByClassName("book-shelf");
    const navBarButton = document.getElementsByClassName("nav-bar-button");

    bookShelfTopPosition();

    if(widthDevice.matches) {
        navBarButton[0].disabled = false;
        navBarButton[1].disabled = false;

        // show unfinished books when UNFINISHED button clicked
        navBarButton[0].addEventListener("click", () => {
            bookShelf[1].style.display = "none";
            bookShelf[0].style.display = "flex";
            navBarButton[1].style.borderBottom = "none";
            navBarButton[0].style.borderBottom = "0.5rem solid";
        });

        // show unfinished books when UNFINISHED button clicked
        navBarButton[1].addEventListener("click", () => {
            bookShelf[0].style.display = "none";
            bookShelf[1].style.display = "flex";
            navBarButton[0].style.borderBottom = "none";
            navBarButton[1].style.borderBottom = "0.5rem solid";
        });

        // UNFINISHED list as default book list
        navBarButton[0].click();
    } else {
        bookShelf[0].style.display = "flex";
        bookShelf[1].style.display = "flex";
        navBarButton[0].disabled = true;
        navBarButton[0].style.borderBottom = "none";
        navBarButton[1].disabled = true;
        navBarButton[1].style.borderBottom = "none";
    }
}

function bookShelfTopPosition() {
    const bookShelf = document.getElementsByClassName("book-shelf");
    const headBar = document.getElementsByClassName("head-bar");
    const headBarHeight = headBar[0].offsetHeight;
    bookShelf[0].style.marginTop = (headBarHeight).toString() + "px";
    bookShelf[1].style.marginTop = (headBarHeight).toString() + "px";
}