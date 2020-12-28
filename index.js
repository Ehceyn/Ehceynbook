// book arrangement
class storedBooks {
    constructor(title, author, isbn, cover) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.cover = cover;
    }
}


// UI

class UI {
    static displayBook() {
            const books=Store.getBooks();

            books.forEach((book) => {
            UI.addBookToList(book);
        });
console.log(books);
    };

    static addBookToList(book){    
        const list=document.querySelector('#booklist');
        const row=document.createElement('tr');
        row.innerHTML=
            `<td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><img src='${book.cover}' alt='book-cover' width='100' height='100'/></td>
            <td><a href='#' class='delete'>X</a></td>
            `
        ;
        list.appendChild(row);
        console.log(book.cover);
    };

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
   
    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
        document.querySelector('#cover').value='';
        document.querySelector('#upload').value='';
    }

    static showAlert(message, className){
        const div= document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('#container');
        const form=document.querySelector('#book-form');
        container.insertBefore(div,form);

        // Vanish in 3sec
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000);

        document.querySelector('input[type=submit]').className='disabled';
        setTimeout(() => {
            document.querySelector('disabled').remove();
        }, 3000);
    }
}

// localStorage 
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }else{
            books=JSON.parse(localStorage.getItem('books'));
        }

    return books;
    }

    static addBook(book){
        const books=Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books =Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    };
};

// ui display books
document.addEventListener('DOMContentLoaded', UI.displayBook());

// Event: add book
document.addEventListener('submit', (e)=>{

    e.preventDefault();

    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    const coverFunc=()=>{
        let coverImg=document.querySelector('img');
        let file=document.querySelector('#cover').files[0];
        let reader=new FileReader();
        reader.onloadend=()=>{coverImg.src=reader.result; };

        if(file){
            reader.readAsDataURL(file);
        }else{
            coverImg.src='';
        }


        console.log(coverImg);

    }
   
    if(title==='' || author==='' || isbn===''){
        UI.showAlert('Please fill all fields','danger');
      
    }else{
        const setbook=new storedBooks(title, author, isbn);
        UI.addBookToList(setbook);

        // Add book to store
        Store.addBook(setbook);

        // show success alert
        UI.showAlert('Book added successfully','success');

        console.log(setbook);

        // clear input fields
        UI.clearFields();
    }
    
});



// Event:remove book
document.querySelector('#booklist').addEventListener('click', (e)=>{
    UI.deleteBook(e.target);

    // Delete book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    // Show success alert 
    UI.showAlert('Book deleted successfully','success');


    
})