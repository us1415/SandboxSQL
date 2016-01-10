"use strict";

var TokenTypes = require('../constants/TokenTypes');

class AliasToken {
  constructor(
    subToken,
    aliasName
  ) {
    this.subToken = subToken;
    this.aliasName = aliasName;
  }

  getType() {
    return TokenTypes.ALIAS;
  }

  toString() {
    return `
      TOKEN ALIAS 
      aliasName: "${this.aliasName}"`;
  }

  isColumnLike() {
    // maybe this will not always be true?
    return true;
  }

  exportToQuery(prev, next) {
    var subText = this.subToken.exportToQuery(null, null);
    var result = `${subText} as ${this.aliasName}`;
    if (next && next.isColumnLike && next.isColumnLike()) {
      return result + ',';
    }
    return result;
  }
}

module.exports = AliasToken;