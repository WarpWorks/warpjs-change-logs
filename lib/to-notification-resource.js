const ChangeLogs = require('./change-logs');
// const debug = require('./debug')('to-notification-resource');

module.exports = async (persistence, domain, documentJson) => {
    const changeLogs = new ChangeLogs(documentJson);
    return changeLogs.toNotificationResource(persistence, domain);
};
