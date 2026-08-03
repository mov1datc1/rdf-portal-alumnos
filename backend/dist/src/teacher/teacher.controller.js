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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const teacher_service_1 = require("./teacher.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let TeacherController = class TeacherController {
    teacherService;
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    getDashboard(req) {
        return this.teacherService.getDashboard(req.user.id);
    }
    getMyGroups(req) {
        return this.teacherService.getMyGroups(req.user.id);
    }
    getMyStudents(req) {
        return this.teacherService.getMyStudents(req.user.id);
    }
    getMySchedule(req) {
        return this.teacherService.getMySchedule(req.user.id);
    }
    recordAttendance(body) {
        return this.teacherService.recordAttendance(body);
    }
    getAttendance(resourceId) {
        return this.teacherService.getAttendance(resourceId);
    }
    getMyEvaluations(req) {
        return this.teacherService.getMyEvaluations(req.user.id);
    }
    createEvaluation(req, body) {
        return this.teacherService.createEvaluation(req.user.id, body);
    }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('groups'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getMyGroups", null);
__decorate([
    (0, common_1.Get)('students'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getMyStudents", null);
__decorate([
    (0, common_1.Get)('schedule'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getMySchedule", null);
__decorate([
    (0, common_1.Post)('attendance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "recordAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/:resourceId'),
    __param(0, (0, common_1.Param)('resourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)('evaluations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getMyEvaluations", null);
__decorate([
    (0, common_1.Post)('evaluations'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createEvaluation", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teacher'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map