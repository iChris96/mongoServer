"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonController_1 = require("../controllers/jsonController");
const router = express_1.Router();
router.route('/create')
    .get(jsonController_1.jsonController.createJsonGet)
    .post(jsonController_1.jsonController.createJsonPost);
exports.default = router;
//# sourceMappingURL=json.js.map