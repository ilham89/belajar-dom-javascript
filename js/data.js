const STORAGE_KEY = "BOOKS_APPS";
 
let books = [];
 
function isStorageExist() /* boolean */ {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}
 
function saveData() {
    try {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event("ondatasaved"));
    } catch {
        alert("Buku gagal disimpat di local storage!")
    }
}
 
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}
 
function updateDataToStorage() {
    if(isStorageExist()) {
        const listUnfinishedRead = document.getElementById(UNFINISHED_READ_LIST_BOOKS_ID);
        const listFinishedRead = document.getElementById(FINISHED_READ_LIST_BOOKS_ID);
        tellIfBookEmpty(listFinishedRead);
        tellIfBookEmpty(listUnfinishedRead);
        
        saveData();
    }
}
 
function composeBookObject(bookName, authorName, yearReleased, isFinishedRead) {
    return {
        id: +new Date(),
        title: bookName,
        author: authorName,
        year: yearReleased,
        isComplete: isFinishedRead
    };
}
 
function findBookById(bookId) {
    for(book of books){
        if(book.id === bookId)
            return book;
    }
    return null;
}
 
function findBookIndexById(bookId) {
    let index = 0
    for (book of books) {
        if(book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

function getBooksElementFromStorage() {
    const listUnfinishedRead = document.getElementById(UNFINISHED_READ_LIST_BOOKS_ID);
    const listFinishedRead = document.getElementById(FINISHED_READ_LIST_BOOKS_ID);

    listUnfinishedRead.innerHTML = null;
    listFinishedRead.innerHTML = null;
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOKS_ITEMID] = book.id;

        if(book.isComplete){
            listFinishedRead.prepend(newBook);
        } else {
            listUnfinishedRead.prepend(newBook);
        }
    }

    tellIfBookEmpty(listFinishedRead);
    tellIfBookEmpty(listUnfinishedRead);
}