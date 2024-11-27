"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginate = void 0;
function Paginate(queryBuilder, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * perPage;
        const [data, total] = yield queryBuilder
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
    });
}
exports.Paginate = Paginate;
