const ChangeLogs = require('./change-logs');

module.exports = async (instance, domain, persistence, routeName, userEntity) => {
    const changeLogs = new ChangeLogs(instance);

    return changeLogs.toFormResource(domain, persistence, routeName, userEntity);
};
