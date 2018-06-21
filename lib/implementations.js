const _ = require('lodash');

const actions = require('./actions');

module.exports = Object.freeze(_.reduce(
    actions,
    (memo, value, key) => _.extend(memo, { [value]: require(`./${value}`) }),
    {}
));
