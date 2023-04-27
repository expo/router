const { validate } = require("schema-utils");
const schema = require("./options.json");

module.exports = (config, props) => {
  validate(schema, options);

  if (!config.extra) {
    config.extra = {};
  }
  if (!config.extra.router) {
    config.extra.router = {};
  }

  config.extra.router = {
    ...config.extra.router,
    ...props,
  };

  return config;
};
