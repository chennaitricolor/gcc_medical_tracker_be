const { mergeIgnoringUndefined } = require('../utils/helpers');

const env = process.env.NODE_ENV;

module.exports = mergeIgnoringUndefined(require('./defaults'), env ? require(`./${env}`) : /* istanbul ignore next */ require('./local'));
