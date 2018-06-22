const ChangeLogs = require('./change-logs');
const ChangeLogsError = require('./error');
const IMPLEMENTATIONS = require('./implementations');
const pickUserInfo = require('./pick-user-info');

module.exports = (action, user, instance, data) => {
    const ChangeLog = IMPLEMENTATIONS[action];

    if (!ChangeLog) {
        throw new ChangeLogsError(`Invalid action='${action}'.`);
    }

    const changeLogs = new ChangeLogs(instance);
    changeLogs.add(new ChangeLog(pickUserInfo(user), data));

    return instance;
};
