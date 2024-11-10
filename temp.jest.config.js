module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)" // Allow Jest to process `axios` as an ES module
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy" // Mock CSS imports
    },
  };