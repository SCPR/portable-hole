'use strict';

module.exports = class {
  static stripProtocol(str) {
    return str.replace(/^https?:/, "");
  }

  static stripTrailingSlash(str) {
    return str.replace(/\/$/, "");
  }

  static convertProtocolToHttp(str) {
    return str.replace(/^https:/, 'http:');
  }

  static convertProtocolToHttps(str) {
    return str.replace(/^http:/, 'https:');
  }
};

