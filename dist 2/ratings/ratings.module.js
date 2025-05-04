"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ratings_entity_1 = require("./entities/ratings.entity");
const ratings_service_1 = require("./ratings.service");
const ratings_controller_1 = require("./ratings.controller");
const users_module_1 = require("../users/users.module");
const content_module_1 = require("../content/content.module");
let RatingModule = class RatingModule {
};
exports.RatingModule = RatingModule;
exports.RatingModule = RatingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ratings_entity_1.Rating]), users_module_1.UsersModule, content_module_1.ContentModule],
        providers: [ratings_service_1.RatingService],
        controllers: [ratings_controller_1.RatingController],
    })
], RatingModule);
//# sourceMappingURL=ratings.module.js.map