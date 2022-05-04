document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".float-section .ic-add");
    const searchButton = document.querySelector(".head-bar .ic-search");
    const searchForm = document.getElementById("searchBook");
    const inputBookForm = document.getElementById("inputBook");
    const mobileMaxSize = window.matchMedia("(max-width: 500px)");

    addButton.addEventListener("click", () => {
        showInputBookForm(true);
    })

    searchButton.addEventListener("click", (event) => {
        showSearchBookForm(true);
        event.target.style.display = "none"
    })

    searchForm.addEventListener("text", (event) => {
        event.target.reset();
    })

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        showBooksSearched(true);
    });

    searchForm.addEventListener("reset", () => {
        showBooksSearched(false);
        showSearchBookForm(false);
        searchButton.style.display = "flex";
    });

    inputBookForm.addEventListener("submit", (event) => {
        event.preventDefault();
        showInputBookForm(false);
        addBook();
        event.target.reset();
    });

    inputBookForm.addEventListener("reset", () => {
        showInputBookForm(false);
    });

    mobileMode(mobileMaxSize);
    mobileMaxSize.addEventListener("change", mobileMode);

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
 });

document.addEventListener("ondataloaded", () => {
    getBooksElementFromStorage();
 });