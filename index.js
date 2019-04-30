// const debug = require('debug')('W2:ChangeLogs:index');

const ACTIONS = require('./lib/actions');
const add = require('./lib/add');
const ChangeLogsError = require('./lib/error');
const toFormResource = require('./lib/to-form-resource');
const toNotificationResource = require('./lib/to-notification-resource');

module.exports = Object.freeze({
    ACTIONS,
    add: (action, user, instance, data) => add(action, user, instance, data),
    Error: ChangeLogsError,
    toFormResource: async (instance, domain, persistence, routeName, userEntity) => toFormResource(instance, domain, persistence, routeName, userEntity),
    toNotificationResource: async (persistence, domain, documentJson) => toNotificationResource(persistence, domain, documentJson)
});
