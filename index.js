//imported the required node modules

const express = require('express')
const cors = require('cors')
require('dotenv').config()

//imported the local modules

const Book = require('./models/books.model')
const { initializeDatabase } = require('./db/db.connect')
const PORT = process.env.PORT || 3000

//server is created
const app = express()

//database is connected
initializeDatabase()

//initial middlewares
app.use(cors())
app.use(express.json())



//database operations

//1.Create a new book instance and add in DB

async function createBook(newBook) {
    try {
        const book = new Book(newBook)
        const savedBook = await book.save()

        return savedBook;
    }
    catch (error) {
        throw error
    }
}

//2.Read all the books from the DB

async function readAllBooks() {
    try {
        const books = await Book.find()
        return books
    }
    catch (error) {
        throw error
    }
}

//3.Read books by title

async function readBookByTitle(bookTitle) {
    try {
        const book = await Book.findOne({ title: bookTitle })
        return book
    }
    catch (error) {
        throw error;
    }
}

//4.Read all books by author

async function readBooksByAuthor(authorName) {
    try {
        const books = await Book.find({ author: authorName })

        return books
    }
    catch (error) {
        throw error;
    }
}

//5.Read all books by Bussiness genre

async function readBooksByGenre(genreName) {
    try {
        const books = await Book.find({ genre: genreName })

        return books
    }
    catch (error) {
        throw error;
    }
}

//6.Read all books by Release Year.

async function readBooksByReleaseYear(releaseYear) {
    try {
        const books = await Book.find({ publishedYear: releaseYear })

        return books
    }
    catch (error) {
        throw error;
    }
}

//7.Update book defails after finding the book by it's ID

async function updateBookById(bookId, dataToUpdate) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, { new: true })

        return updatedBook;
    }
    catch (error) {
        throw error
    }
}

//8.Update book details after finding the book by it's  title
async function updateBookByTitle(bookTitle, dataToUpdate) {
    try {
        const updatedBook = await Book.findOneAndUpdate({ title: bookTitle }, dataToUpdate, { new: true })

        return updatedBook;
    }
    catch (error) {
        throw error
    }
}

//9.Delete a book from DB after finding it by ID

async function deleteBooksById(bookId) {
    try {
        const deletedBook = await Book.findByIdAndDelete(bookId)

        return deletedBook
    }
    catch (error) {
        throw error;
    }
}


//API routes

//1.adding new book
app.post('/books', async (req, res) => {
    try {
        const savedBook = await createBook(req.body)
        if (savedBook) {
            res.status(201).json({ message: "Book added successfully", savedBook: savedBook })
        }
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred. ${error}` })
    }
})

//2.getting all the books
app.get('/books', async (req, res) => {
    try {
        const allBooks = await readAllBooks()

        res.status(200).json({ allBooks })
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred: ${error}` })
    }
})

//3.getting book by title
app.get('/books/:title', async (req, res) => {
    try {
        const title = req.params.title
        const book = await readBookByTitle(title)

        if (book) {
            res.status(200).json({ book })
        }
        else {
            res.status(404).json({ error: 'No book matches the title.' })
        }
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//4.getting books filtered by author

app.get('/books/author/:authorName', async (req, res) => {
    try {
        const books = await readBooksByAuthor(req.params.authorName)

        if (books) {
            res.status(200).json({ books })
        }
        else {
            res.status(404).json({ error: 'No book matches the author.' })
        }

    }
    catch (error) {
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//5.getting books filtered by genre

app.get('/books/genre/:genreName', async (req, res) => {
    try {
        const books = await readBooksByGenre(req.params.genreName)

        if (books) {
            res.status(200).json({ books })
        }
        else {
            res.status(404).json({ error: 'No book matches the genre.' })
        }

    }
    catch (error) {
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//6.getting books filtered by releaseYear

app.get('/books/publishYear/:year', async (req, res) => {
    try {
        const books = await readBooksByReleaseYear(req.params.year)

        if (books) {
            res.status(200).json({ books })
        }
        else {
            res.status(404).json({ error: 'No book matches the author.' })
        }

    }
    catch (error) {
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//7.update by Id

app.post('/books/:bookId', async (req, res) => {
    try {
        const updatedBook = await updateBookById(req.params.bookId, req.body)

        if (updatedBook) {
            res.status(202).json({ message: 'Updated the book details', updatedBook: updatedBook })
        }
        else {
            res.status(404).json({ error: 'No book matches the given book id.' })
        }
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//8.update by Title

app.post('/books/title/:bookTitle', async (req, res) => {
    try {
        const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body)

        if (updatedBook) {
            res.status(202).json({ message: 'Updated the book details', updatedBook: updatedBook })
        }
        else {
            res.status(404).json({ error: 'No book matches the given book title.' })
        }
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//9. delete book by ID

app.delete('/books/:bookId', async (req, res) => {
    try {
        const deletedBook = await deleteBooksById(req.params.bookId)

        if (deletedBook) {
            res.status(200).json({ message: 'Book deleted successfully', deletedBook: deletedBook })
        }
        else {
            res.status(404).json({ error: 'No book matches the given book id.' })
        }
    }
    catch(error){
        res.status(500).json({ error: `An error occurred, ${error}` })
    }
})

//listening server

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
