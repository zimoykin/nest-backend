"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Todo = void 0;
var typeorm_1 = require("typeorm");
var folder_entity_1 = require("./folder.entity");
var user_entity_1 = require("./user.entity");
var Todo = /** @class */ (function () {
    function Todo() {
    }
    Todo.prototype.output = function () {
        return { id: this.id,
            title: this.title,
            descr: this.descr,
            folder: this.folder.shortoutput(),
            user: this.user.shortoutput()
        };
    };
    Todo.prototype.shortoutput = function () {
        return { id: this.id,
            title: this.title,
            descr: this.descr
        };
    };
    Todo.relations = ['user', 'user.todos', 'folder', 'folder.user', 'folder.todos'];
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Todo.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Todo.prototype, "title");
    __decorate([
        typeorm_1.Column()
    ], Todo.prototype, "descr");
    __decorate([
        typeorm_1.Column({ type: 'boolean', "default": true })
    ], Todo.prototype, "isDone");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamptz', "default": function () { return 'CURRENT_TIMESTAMP'; } })
    ], Todo.prototype, "createDateTime");
    __decorate([
        typeorm_1.UpdateDateColumn({ type: 'timestamptz', "default": function () { return 'CURRENT_TIMESTAMP'; } })
    ], Todo.prototype, "lastChangedDateTime");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_entity_1.User; }, function (user) { return user.todos; }),
        typeorm_1.JoinColumn({ name: "userId" })
    ], Todo.prototype, "user");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return folder_entity_1.Folder; }, function (folder) { return folder.todos; }),
        typeorm_1.JoinColumn({ name: "folderId" })
    ], Todo.prototype, "folder");
    Todo = __decorate([
        typeorm_1.Entity('todo')
    ], Todo);
    return Todo;
}());
exports.Todo = Todo;
