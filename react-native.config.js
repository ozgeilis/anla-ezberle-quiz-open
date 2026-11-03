// The first iOS release has no advertising SDK. Android keeps its existing
// AdMob autolinking and test-only consent/advertising implementation.
module.exports = {
  dependencies: {
    "react-native-google-mobile-ads": {
      platforms: { ios: null },
    },
  },
};
