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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const supabase_js_1 = require("@supabase/supabase-js");
let ProfileController = class ProfileController {
    supabase;
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    async changePassword(req, body) {
        const userId = req.user?.sub || req.user?.id;
        if (!userId) {
            throw new common_1.HttpException('Usuario no autenticado', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!body.newPassword || body.newPassword.length < 6) {
            throw new common_1.HttpException('La nueva contraseña debe tener al menos 6 caracteres', common_1.HttpStatus.BAD_REQUEST);
        }
        const { error } = await this.supabase.auth.admin.updateUserById(userId, {
            password: body.newPassword,
        });
        if (error) {
            throw new common_1.HttpException(`Error al cambiar contraseña: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
        return { success: true, message: 'Contraseña actualizada exitosamente' };
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "changePassword", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map