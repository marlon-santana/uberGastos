const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...(config.resolver.alias || {}),
  "react-native-google-mobile-ads": path.resolve(
    __dirname,
    "node_modules/react-native-google-mobile-ads/lib/commonjs/index.js",
  ),
};

module.exports = config;
