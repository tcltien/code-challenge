import { BookRepository } from "./book.repository";
import { getDb } from "../config/db";
import { CreateBookDTO, BookFilterDTO } from "../dtos/book.dto";

jest.mock("../config/db", () => ({
    getDb: jest.fn()
}));

describe("BookRepository Unit Test", () => {
    let bookRepository: BookRepository;

    let mockDb: {
        run: jest.Mock;
        get: jest.Mock;
        all: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            run: jest.fn(),
            get: jest.fn(),
            all: jest.fn()
        };

        (getDb as jest.Mock).mockResolvedValue(mockDb);

        bookRepository = new BookRepository();
    });

    // =========================
    // CREATE
    // =========================
    describe("create", () => {
        it("should create book and return it with lastID", async () => {
            const input: CreateBookDTO = {
                title: "Clean Code",
                author: "Uncle Bob",
                publishedYear: 2008,
                genre: "Software"
            };

            mockDb.run.mockResolvedValue({ lastID: 1 });

            const result = await bookRepository.create(input);

            expect(result).toEqual({
                id: 1,
                ...input
            });
            expect(mockDb.run).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO books"),
                ["Clean Code", "Uncle Bob", 2008, "Software"]
            );
        });

        it("should throw error if database insert fails (Failure Test)", async () => {
            mockDb.run.mockRejectedValue(new Error("INSERT_FAILED"));

            await expect(bookRepository.create({ title: "Error Book", author: "A" }))
                .rejects.toThrow("INSERT_FAILED");
        });
    });

    // =========================
    // FIND BY ID
    // =========================
    describe("findById", () => {
        it("should return book when found", async () => {
            const mockBook = { id: 1, title: "Book" };
            mockDb.get.mockResolvedValue(mockBook);

            const result = await bookRepository.findById(1);

            expect(result).toEqual(mockBook);
            expect(mockDb.get).toHaveBeenCalledWith(
                `SELECT * FROM books WHERE id = ?`,
                [1]
            );
        });

        it("should return undefined if not found (Fixed Matcher)", async () => {
            // Khớp với hành vi thực tế của SQLite driver là trả về undefined thay vì null
            mockDb.get.mockResolvedValue(undefined);

            const result = await bookRepository.findById(999);

            expect(result).toBeUndefined();
        });

        it("should throw error if select by id fails (Failure Test)", async () => {
            mockDb.get.mockRejectedValue(new Error("QUERY_ID_FAILED"));

            await expect(bookRepository.findById(1)).rejects.toThrow("QUERY_ID_FAILED");
        });
    });

    // =========================
    // FIND ALL (PAGINATION & FILTERS FIXED)
    // =========================
    describe("findAll", () => {
        it("should return books with pagination and unconditional total count", async () => {
            mockDb.all.mockResolvedValue([{ id: 1, title: "Book A" }]);
            mockDb.get.mockResolvedValue({ total: 10 }); // Mock cho câu COUNT(*)

            const result = await bookRepository.findAll({
                filters: {},
                limit: 10,
                offset: 0
            });

            expect(result).toEqual({
                data: [{ id: 1, title: "Book A" }],
                pagination: { total: 10, limit: 10, offset: 0 }
            });

            // Kiểm tra thứ tự tham số chuẩn xác của LIMIT và OFFSET cuối query
            expect(mockDb.all).toHaveBeenCalledWith(
                expect.stringContaining("LIMIT ? OFFSET ?"),
                [10, 0]
            );
        });

        it("should apply author filter to both data query and total count", async () => {
            mockDb.all.mockResolvedValue([]);
            mockDb.get.mockResolvedValue({ total: 5 });

            await bookRepository.findAll({
                filters: { author: "Author A" },
                limit: 10,
                offset: 0
            });

            // Kiểm tra mảng tham số được truyền đúng thứ tự vào db.all
            expect(mockDb.all.mock.calls[0][1]).toEqual(["%Author A%", 10, 0]);

            // Khắc phục lỗi test cũ: db.get của lệnh COUNT(*) thực tế không nhận param filter nào cả
            expect(mockDb.get).toHaveBeenCalledWith(
                expect.stringContaining("WHERE 1=1 AND author LIKE ?"),
                ["%Author A%"]
            );
        });

        it("should apply multiple filters in correct order", async () => {
            mockDb.all.mockResolvedValue([]);
            mockDb.get.mockResolvedValue({ total: 0 });

            await bookRepository.findAll({
                filters: { title: "Clean", author: "Bob", genre: "Sci-Fi" },
                limit: 5,
                offset: 10
            });

            const args = mockDb.all.mock.calls[0][1];
            // Đảm bảo thứ tự mapping từ câu if-else đẩy vào mảng values một cách chính xác tuyệt đối
            expect(args).toEqual(["%Clean%", "%Bob%", "Sci-Fi", 5, 10]);
        });

        it("should throw error if query all fails (Failure Test)", async () => {
            mockDb.all.mockRejectedValue(new Error("FETCH_ALL_FAILED"));

            await expect(bookRepository.findAll({ filters: {}, limit: 10, offset: 0 }))
                .rejects.toThrow("FETCH_ALL_FAILED");
        });
    });

    // =========================
    // UPDATE
    // =========================
    describe("update", () => {
        it("should return null if no fields are provided to update", async () => {
            const result = await bookRepository.update(1, {});
            expect(result).toBeNull();
            expect(mockDb.run).not.toHaveBeenCalled();
        });

        it("should execute update query and return updated book details", async () => {
            mockDb.run.mockResolvedValue({ changes: 1 });
            const mockUpdatedBook = { id: 1, title: "Updated Title" };

            // Do trong repo bạn viết `return this.findById(id);`, nên ta mock cho lần gọi db.get kế tiếp
            mockDb.get.mockResolvedValue(mockUpdatedBook);

            const result = await bookRepository.update(1, { title: "Updated Title" });

            expect(result).toEqual(mockUpdatedBook);
            expect(mockDb.run).toHaveBeenCalledWith(
                `UPDATE books SET title = ? WHERE id = ?`,
                ["Updated Title", 1]
            );
        });

        it("should throw error if database update statement fails (Failure Test)", async () => {
            mockDb.run.mockRejectedValue(new Error("UPDATE_SQL_ERROR"));

            await expect(bookRepository.update(1, { title: "New" }))
                .rejects.toThrow("UPDATE_SQL_ERROR");
        });
    });

    // =========================
    // DELETE
    // =========================
    describe("delete", () => {
        it("should return true when changes > 0", async () => {
            mockDb.run.mockResolvedValue({ changes: 1 });

            const result = await bookRepository.delete(1);

            expect(result).toBe(true);
            expect(mockDb.run).toHaveBeenCalledWith(
                `DELETE FROM books WHERE id = ?`,
                [1]
            );
        });

        it("should return false when changes === 0", async () => {
            mockDb.run.mockResolvedValue({ changes: 0 });

            const result = await bookRepository.delete(999);

            expect(result).toBe(false);
        });

        it("should throw error if database deletion fails (Failure Test)", async () => {
            mockDb.run.mockRejectedValue(new Error("DELETE_FAILED"));

            await expect(bookRepository.delete(1)).rejects.toThrow("DELETE_FAILED");
        });
    });
});