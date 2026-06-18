export interface Book {
    id?: number;
    title: string;
    author: string;
    publishedYear?: number;
    genre?: string;
    createdAt?: Date;
}

export interface BookFilters {
    title?: string;
    author?: string;
    publishedYear?: number;
    genre?: string;
}