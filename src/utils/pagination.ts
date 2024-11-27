import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Request } from "express";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function Paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  req: Request
): Promise<{
  data: T[];
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  perPage: number;
  currentPage: number;
}> {
  const page: number = parseInt(req.query.page as string) || 1;
  const perPage: number = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * perPage;

  const [data, total] = await queryBuilder
    .skip(offset)
    .take(perPage)
    .getManyAndCount();

  const totalPages = Math.ceil(total / perPage);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const currentPage = page;
  return {
    data,
    total,
    totalPages,
    hasNext,
    hasPrev,
    perPage,
    currentPage,
  };
}
