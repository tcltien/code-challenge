import request from "supertest";
import express from "express";
import { BookController } from "./book.controller";
import { BookService } from "../services/book.service";
import { BookRepository } from "../repository/book.repository"; // Import BookRepository for mocking
import { errorMiddleware } from "../middleware/error.middleware";
import { validate } from "../middleware/validation.middleware";
import { CreateBookSchema, UpdateBookSchema, FilterBookSchema, BookIdSchema } from "../schemas/book.schema";
import { z } from "zod";

// Mock the entire BookService to isolate the Controller layer
jest.mock("../services/book.service");
// Mock BookRepository as well, as BookService now depends on it
jest.mock("../repository/book.repository");
describe("BookController Integration Tests (Full API Coverage)", () => {
    let app: express.Application;
    let mockBookServiceInstance: jest.Mocked<BookService>;
    beforeAll(() => {
        app = express();
        app.use(express.json());
        // Create mocked instances
        const mockBookRepository = new BookRepository() as jest.Mocked<BookRepository>;
        const mockBookService = new BookService(mockBookRepository) as jest.Mocked<BookService>;
        const controller = new BookController(mockBookService);

        // Mount the controller routes for testing
        app.post("/api/books", validate(CreateBookSchema), controller.create);
        app.get("/api/books", validate(FilterBookSchema), controller.list);
        app.get("/api/books/:id", validate(z.object({ params: BookIdSchema })), controller.getDetails);
        app.put("/api/books/:id", validate(UpdateBookSchema), controller.update);
        app.delete("/api/books/:id", validate(z.object({ params: BookIdSchema })), controller.delete);
        app.use(errorMiddleware);
        mockBookServiceInstance = mockBookService;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // 1. TEST API: POST /api/books (Create)
    // ==========================================
    describe("POST /api/books", () => {
        it("should return 400 if title or author is missing", async () => {
            const res = await request(app)
                .post("/api/books")
                .send({ title: "Only Title Provided" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation Failed");
        });

        it("should return 201 and the created book when valid", async () => {
            const validBook = { title: "Clean Architecture", author: "Uncle Bob", publishedYear: 2017, genre: "Software" };
            mockBookServiceInstance.createBook.mockResolvedValue({ id: 1, ...validBook });
            const res = await request(app)
                .post("/api/books")
                .send(validBook);
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: 1, ...validBook });
            expect(mockBookServiceInstance.createBook).toHaveBeenCalledWith(validBook);
        });

        it("should return 500 if an internal server error occurs", async () => {
            mockBookServiceInstance.createBook.mockRejectedValue(new Error("DB Error"));
            const res = await request(app)
                .post("/api/books")
                .send({ title: "Error", author: "Error" });

            expect(res.status).toBe(500);
            expect(res.body.error).toBe("An unexpected error occurred.");
        });
    });

    // ==========================================
    // 2. TEST API: GET /api/books (List/Filter)
    // ==========================================
    describe("GET /api/books", () => {
        it("should return 200 and a list of books with query parameters", async () => {
            const mockResult = {
                data: [{ id: 1, title: "Test Book", author: "Test Author", genre: "Coding" }],
                pagination: { total: 1, limit: 10, offset: 0 }
            };
            mockBookServiceInstance.listBooks.mockResolvedValue(mockResult);

            const res = await request(app)
                .get("/api/books")
                .query({ title: "Test", author: "Test", genre: "Coding" });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockResult);
            expect(mockBookServiceInstance.listBooks).toHaveBeenCalledWith({
                title: "Test",
                author: "Test",
                genre: "Coding",
                page: 1,
                limit: 10
            });
        });

        it("should return 500 if service fails", async () => {
            mockBookServiceInstance.listBooks.mockRejectedValue(new Error("Failed to fetch"));
            const res = await request(app).get("/api/books");
            expect(res.status).toBe(500);
            expect(res.body.error).toBe("An unexpected error occurred.");
        });
    });

    // ==========================================
    // 3. TEST API: GET /api/books/:id (Get Details)
    // ==========================================
    describe("GET /api/books/:id", () => {
        it("should return 400 if ID is invalid (not a number)", async () => {
            const res = await request(app).get("/api/books/abc");
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation Failed");
        });

        it("should return 404 if the book is not found", async () => {
            mockBookServiceInstance.getBookById.mockResolvedValue(null);
            const res = await request(app).get("/api/books/999");
            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Book not found");
        });

        it("should return 200 and the book data if found", async () => {
            const mockBook = { id: 5, title: "Found Book", author: "Author" };
            mockBookServiceInstance.getBookById.mockResolvedValue(mockBook);
            const res = await request(app).get("/api/books/5");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockBook);
            expect(mockBookServiceInstance.getBookById).toHaveBeenCalledWith(5);
        });

        it("should return 500 if an error occurs", async () => {
            mockBookServiceInstance.getBookById.mockRejectedValue(new Error("Crash"));
            const res = await request(app).get("/api/books/5");
            expect(res.status).toBe(500);
        });
    });

    // ==========================================
    // 4. TEST API: PUT /api/books/:id (Update)
    // ==========================================
    describe("PUT /api/books/:id", () => {
        it("should return 400 if ID is invalid", async () => {
            const res = await request(app).put("/api/books/xyz").send({ title: "New" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation Failed");
        });

        it("should return 404 if update fails (book not found or no fields changed)", async () => {
            mockBookServiceInstance.updateBook.mockResolvedValue(null);
            const res = await request(app).put("/api/books/10").send({ title: "Ghost Book" });
            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Book not found");
        });

        it("should return 200 and the updated book data upon success", async () => {
            const mockUpdatedBook = { id: 10, title: "Updated Title", author: "Author" };
            mockBookServiceInstance.updateBook.mockResolvedValue(mockUpdatedBook);
            const res = await request(app).put("/api/books/10").send({ title: "Updated Title" });
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUpdatedBook);
            expect(mockBookServiceInstance.updateBook).toHaveBeenCalledWith(10, { title: "Updated Title" });
        });

        it("should return 500 if server fails during update", async () => {
            mockBookServiceInstance.updateBook.mockRejectedValue(new Error("Update Crash"));
            const res = await request(app).put("/api/books/10").send({ title: "Test" });
            expect(res.status).toBe(500);
        });
    });

    // ==========================================
    // 5. TEST API: DELETE /api/books/:id (Delete)
    // ==========================================
    describe("DELETE /api/books/:id", () => {
        it("should return 400 if ID is invalid", async () => {
            const res = await request(app).delete("/api/books/notanumber");
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation Failed");
        });

        it("should return 404 if the book to delete does not exist", async () => {
            mockBookServiceInstance.deleteBook.mockResolvedValue(false);
            const res = await request(app).delete("/api/books/99");
            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Book not found");
        });

        it("should return 200 and success message when deleted successfully", async () => {
            mockBookServiceInstance.deleteBook.mockResolvedValue(true);
            const res = await request(app).delete("/api/books/12");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Book deleted successfully");
            expect(mockBookServiceInstance.deleteBook).toHaveBeenCalledWith(12);
        });

        it("should return 500 if delete operation crashes", async () => {
            mockBookServiceInstance.deleteBook.mockRejectedValue(new Error("Delete Crash"));
            const res = await request(app).delete("/api/books/12");
            expect(res.status).toBe(500);
        });
    });
});