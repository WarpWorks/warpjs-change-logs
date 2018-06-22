const Promise = require('bluebird');

const ChangeLogs = require('./change-logs');

module.exports = (instance, domain, persistence, routeName, userEntity) => {
    const changeLogs = new ChangeLogs(instance);

    return Promise.resolve()
        .then(() => changeLogs.toFormResource(domain, persistence, routeName, userEntity))
    ;
};
