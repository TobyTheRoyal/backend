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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { username, email, password } = registerDto;
        try {
            console.log('Registering user:', { username, email });
            const existingUserByEmail = await this.usersService.findByEmail(email);
            if (existingUserByEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
            const existingUserByUsername = await this.usersService.findByUsername(username);
            if (existingUserByUsername) {
                throw new common_1.ConflictException('Username already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.usersService.create({ username, email, password: hashedPassword });
            const payload = { username: user.username, sub: user.id };
            const access_token = this.jwtService.sign(payload);
            console.log('Generated token:', access_token);
            return { access_token };
        }
        catch (error) {
            console.error('Registration error:', error.message, error.stack);
            throw error;
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        try {
            console.log('Login attempt:', { email });
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                console.log('User not found:', email);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Password invalid for:', email);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { username: user.username, sub: user.id };
            const access_token = this.jwtService.sign(payload);
            console.log('Login successful, token:', access_token);
            return { access_token };
        }
        catch (error) {
            console.error('Login error:', error.message, error.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map