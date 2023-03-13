const {
  createRequestHandler,
} = require("../../../../../expo/packages/@expo/server/build/vendor/netlify");

// netlify dev
const handler = createRequestHandler({
  build: require("path").join(__dirname, "../../dist"),
  mode: process.env.NODE_ENV,
});

module.exports = { handler };
