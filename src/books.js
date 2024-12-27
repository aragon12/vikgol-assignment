import joi from "joi";
import { validator } from "./validator.js";
import { clearCache, getfromCache } from "./db/redis.js";
import { broadcast } from "./socket/socket.js";

const bookSchema = joi.object({
    title: joi.string().trim().min(1).required(),
    author: joi.string().trim().min(1).required(),
    publishedYear: joi.number().integer().min(1900).max(parseInt((new Date()).getFullYear())).required(),
    genre: joi.string().trim().min(1).required()
});

const createBook = (req, res) => {
    const validate = validator(bookSchema, req.body);

    if (validate.error) {
        return res.status(400).json({
            success: false,
            message: validate.message,
            code: 'invalid_arguments'
        });
    }

    const { books } = global.db;
    const { value: book } = validate;
    book['id'] = "BK-" + Date.now();
    books.insertOne(book);
    broadcast({
        code: 'book_create',
        data: book
    });
    res.status(201).json({ success: true, id: book.id });
}

const getBooks = (req, res) => {
    const { books } = global.db;
    res.status(200).json({ books: books.find() });
};

const getBookById = async (req, res) => {
    const { id: bookId = "" } = req.params;
    const book = await getfromCache(bookId, async () => {
        const { books } = global.db;
        const book = books.findOne({ id: bookId });
        if (book?.id) {
            return book;
        }
    }, 30);

    if (!book?.id) {
        return res.status(404).json({
            success: false,
            message: `book not found with id "${bookId}"`
        });
    }

    res.status(200).json({ success: true, book });
};

const deleteBookById = async (req, res) => {
    const { id = "" } = req.params;
    const { books } = global.db;
    books.deleteOne({ id });
    await clearCache(id);
    res.status(200).json({ success: true, book: { id } });
}

export default {
    createBook,
    getBooks,
    getBookById,
    deleteBookById
}