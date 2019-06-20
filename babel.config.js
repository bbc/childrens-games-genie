// babel.config.js is needed so that genie in node_modules is transpiled
// .babelrc files ignore node_modules from Babel 7 onwards
module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        debug: false,
        targets: {
          ie: "11",
          safari: "9"
        }
      }
    ]
  ];

  const plugins = [];

  return {
    presets,
    plugins
  };
};
