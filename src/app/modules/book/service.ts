import { Book, Prisma } from "@prisma/client";
import prisma from "../../../constants/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { calculatePagination } from "../../../helpers/paginationHelpers";
import { bookSearchableFields } from "./constant";
import { IBookFilters } from "./interface";

const createBook = async (data: Book): Promise<Book> => {
  const result = await prisma.book.create({
    data,
    include: { category: true },
  });

  return result;
};

const getBooks = async (
  { searchTerm, ...filtersData }: IBookFilters,
  options: IPaginationOptions,
  minPrice: number | undefined,
  maxPrice: number | undefined
): Promise<IGenericResponse<Book[]>> => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: bookSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (minPrice && !isNaN(minPrice)) {
    andConditions.push({
      price: { gte: minPrice },
    });
  }

  if (maxPrice && !isNaN(maxPrice)) {
    andConditions.push({
      price: { lte: maxPrice },
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map((key) => ({
        [key]: { equals: (filtersData as any)[key] },
      })),
    });
  }

  const where: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.book.count({ where });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getBooksByCategoryId = async (
  categoryId: string,
  options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { page, limit, skip } = calculatePagination(options);

  const result = await prisma.book.findMany({
    where: { categoryId },
    skip,
    take: limit,
  });

  const total = await prisma.book.count({ where: { categoryId } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getBook = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findFirst({ where: { id } });

  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<Book>
): Promise<Book> => {
  const result = await prisma.book.update({ where: { id }, data: payload });

  return result;
};

const deleteBook = async (id: string): Promise<Book> => {
  const result = await prisma.book.delete({ where: { id } });

  return result;
};

export const BookService = {
  createBook,
  getBooks,
  getBooksByCategoryId,
  getBook,
  updateBook,
  deleteBook,
};
