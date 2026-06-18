import { BookService } from "./book.service";
import { BookRepository } from "../repository/book.repository";
import { Book } from "../models/book.model";
import { CreateBookDTO, UpdateBookDTO, BookFilterDTO } from "../dtos/book.dto";
jest.mock("../repository/book.repository");

describe("BookService Unit Tests", () => {
    let bookService: BookService;
    let mockBookRepositoryInstance: jest.Mocked<BookRepository>;

    const mockBook: Book = {
        id: 1,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        publishedYear: 1999,
        genre: "Software Engineering"
    };

    beforeEach(() => {
        // Clear for all mocks before each test to ensure test isolation
        jest.clearAllMocks();
        // mock BookRepository 
        mockBookRepositoryInstance = new BookRepository() as jest.Mocked<BookRepository>;
        // initialize BookService with the mocked repository
        bookService = new BookService(mockBookRepositoryInstance);
    });

    // ==========================================
    // 1. Test createBook
    // ==========================================
    describe("createBook", () => {
        it("should successfully create a book and return it", async () => {
            const inputBook: CreateBookDTO = { title: "Clean Code", author: "Robert C. Martin" };
            const expectedResult: Book = { id: 2, ...inputBook };
            mockBookRepositoryInstance.create.mockResolvedValue(expectedResult);
            const result = await bookService.createBook(inputBook);
            expect(mockBookRepositoryInstance.create).toHaveBeenCalledTimes(1);
            expect(mockBookRepositoryInstance.create).toHaveBeenCalledWith(inputBook);
            expect(result).toEqual(expectedResult);
        });
    });

    // ==========================================
    // 2. Test listBooks
    // ==========================================
    describe("listBooks", () => {
        it("should return an array of books matching filters", async () => {
            const filters: BookFilterDTO = { genre: "Software Engineering", page: 1, limit: 10 };
            const expectedResult = { data: [mockBook], pagination: { total: 1, limit: 10, offset: 0 } };
            mockBookRepositoryInstance.findAll.mockResolvedValue(expectedResult);
            const result = await bookService.listBooks(filters);
            expect(mockBookRepositoryInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockBookRepositoryInstance.findAll).toHaveBeenCalledWith({
                filters: {
                    genre: "Software Engineering"
                },
                limit: 10,
                offset: 0
            });
            expect(result).toEqual(expectedResult);
        });
    });

    // ==========================================
    // 3. Test getBookById
    // ==========================================
    describe("getBookById", () => {
        it("should return a book if it exists", async () => {
            mockBookRepositoryInstance.findById.mockResolvedValue(mockBook);
            const result = await bookService.getBookById(1);
            expect(mockBookRepositoryInstance.findById).toHaveBeenCalledTimes(1);
            expect(mockBookRepositoryInstance.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockBook);
        });

        it("should return null if the book is not found", async () => {
            mockBookRepositoryInstance.findById.mockResolvedValue(null);
            const result = await bookService.getBookById(999);
            expect(mockBookRepositoryInstance.findById).toHaveBeenCalledWith(999);
            expect(result).toBeNull();
        });
    });

    // ==========================================
    // 4. Test updateBook
    // ==========================================
    describe("updateBook", () => {
        it("should update and return the book when valid updates are provided", async () => {
            const updates: UpdateBookDTO = { title: "New Title", genre: "Sci-Fi" };
            const updatedBook = { ...mockBook, ...updates };
            mockBookRepositoryInstance.update.mockResolvedValue(updatedBook);
            const result = await bookService.updateBook(1, updates);
            expect(mockBookRepositoryInstance.update).toHaveBeenCalledTimes(1);
            expect(mockBookRepositoryInstance.update).toHaveBeenCalledWith(1, updates);
            expect(result).toEqual(updatedBook);
        });

        it("should return null if updates object results in no changes or book not found", async () => {
            mockBookRepositoryInstance.update.mockResolvedValue(null);
            const result = await bookService.updateBook(1, { title: "No Change" } as UpdateBookDTO);
            expect(mockBookRepositoryInstance.update).toHaveBeenCalledWith(1, { title: "No Change" });
            expect(result).toBeNull();
        });
    });

    // ==========================================
    // 5. Test deleteBook
    // ==========================================
    describe("deleteBook", () => {
        it("should return true when deletion is successful", async () => {
            mockBookRepositoryInstance.delete.mockResolvedValue(true);
            const result = await bookService.deleteBook(1);
            expect(mockBookRepositoryInstance.delete).toHaveBeenCalledTimes(1);
            expect(mockBookRepositoryInstance.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it("should return false if book to delete does not exist", async () => {
            mockBookRepositoryInstance.delete.mockResolvedValue(false);
            const result = await bookService.deleteBook(999);
            expect(mockBookRepositoryInstance.delete).toHaveBeenCalledWith(999);
            expect(result).toBe(false);
        });
    });
});