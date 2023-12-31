import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CategoryService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import { Category } from "@prisma/client";
import pick from "../../../shared/pick";
import { categoryFilterableFields } from "./constant";
import { paginationFields } from "../../../constants/pagination";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse<Category>(res, {
    statusCode: 200,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, paginationFields);

  const { data, meta } = await CategoryService.getCategories(filter, options);

  sendResponse<Category[]>(res, {
    statusCode: 200,
    success: true,
    message: "Categories retrived successfully",
    meta,
    data,
  });
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategory(req.params.id);

  sendResponse<Category>(res, {
    statusCode: 200,
    success: true,
    message: "Category retrived successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.updateCategory(req.params.id, req.body);

  sendResponse<Category>(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.deleteCategory(req.params.id);

  sendResponse<Category>(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
