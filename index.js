// const debug = require('debug')('W2:ChangeLogs:index');

const ACTIONS = require('./lib/actions');
const add = require('./lib/add');
const ChangeLogsError = require('./lib/error');
const toFormResource = require('./lib/to-form-resource');

module.exports = Object.freeze({
    ACTIONS,
    add: (action, user, instance, data) => add(action, user, instance, data),
    Error: ChangeLogsError,
    toFormResource: (instance, domain, persistence, routeName, userEntity) => toFormResource(instance, domain, persistence, routeName, userEntity)
});
