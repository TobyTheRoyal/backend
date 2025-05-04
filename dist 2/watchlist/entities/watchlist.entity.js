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
exports.Watchlist = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const content_entity_1 = require("../../content/entities/content.entity");
let Watchlist = class Watchlist {
    id;
    user;
    content;
    addedAt;
};
exports.Watchlist = Watchlist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Watchlist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.watchlist),
    __metadata("design:type", user_entity_1.User)
], Watchlist.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => content_entity_1.Content, (content) => content.watchlist),
    __metadata("design:type", content_entity_1.Content)
], Watchlist.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Watchlist.prototype, "addedAt", void 0);
exports.Watchlist = Watchlist = __decorate([
    (0, typeorm_1.Entity)('watchlist')
], Watchlist);
//# sourceMappingURL=watchlist.entity.js.map