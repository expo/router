"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_utils_1 = require("schema-utils");
const schema = require("../options.json");
const withRouter = (config, props) => {
    (0, schema_utils_1.validate)(schema, props);
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
