"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const typeorm_1 = require("typeorm");
const watchlist_entity_1 = require("../../watchlist/entities/watchlist.entity");
const ratings_entity_1 = require("../../ratings/entities/ratings.entity");
let Content = class Content {
    id;
    tmdbId;
    type;
    watchlist;
    ratings;
};
exports.Content = Content;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Content.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Content.prototype, "tmdbId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Content.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => watchlist_entity_1.Watchlist, (watchlist) => watchlist.content),
    __metadata("design:type", Array)
], Content.prototype, "watchlist", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ratings_entity_1.Rating, (rating) => rating.content),
    __metadata("design:type", Array)
], Content.prototype, "ratings", void 0);
exports.Content = Content = __decorate([
    (0, typeorm_1.Entity)('contents')
], Content);
//# sourceMappingURL=content.entity.js.map