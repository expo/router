"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = __importDefault(require("schema-utils"));
const schema = require("../options.json");
const withRouter = (config, props) => {
    (0, schema_utils_1.default)(schema, props);
    return {
        ...config,
        extra: {
            ...config.extra,
            router: {
                ...config.extra?.router,
                ...props,
            },
        },
    };
};
exports.default = withRouter;
