const _ = require('lodash');
// const debug = require('debug')('W2:ChangeLogs:index');
const Promise = require('bluebird');

const ACTIONS = require('./lib/actions');
const ChangeLogsError = require('./lib/error');
const IMPLEMENTATIONS = require('./lib/implementations');
const pickUserInfo = require('./lib/pick-user-info');

class ChangeLogs {
    constructor(instance) {
        // Not cloning because change-logs are set in-place of the document.
        this.instance = instance;

        // Make sure document has required structure.
        if (!instance._meta) {
            instance._meta = {};
        }

        if (!instance._meta.history) {
            instance._meta.history = [];
        }

        this.history = instance._meta.history;
    }

    add(changeLog) {
        this.history.push(changeLog.toJSON());
    }

    static add(action, user, instance, data) {
        const ChangeLog = IMPLEMENTATIONS[action];

        if (!ChangeLog) {
            throw new ChangeLogsError(`Invalid action='${action}'.`);
        }

        const userInfo = pickUserInfo(user);
        const changeLogs = new ChangeLogs(instance);
        changeLogs.add(new ChangeLog(user, data));

        return instance;
    }

    toJSON() {
        return this.history;
    }

    toFormResource(domain, persistence, routeName, userEntity) {
        const history = this.toJSON();
        history.reverse();

        const cacheOfUsers = {};

        return Promise.map(
            history,
            (changeLogDocument) => {
                const ChangeLog = IMPLEMENTATIONS[changeLogDocument.action];
                if (!ChangeLog) {
                    return null;
                }

                const changeLog = ChangeLog.fromDocument(changeLogDocument);
                return changeLog.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
            },
            { concurrency: 1 }
        );
    }

    static toFormResource(instance, domain, persistence, routeName, userEntity) {
        const changeLogs = new ChangeLogs(instance);

        return Promise.resolve()
            .then(() => changeLogs.toFormResource(domain, persistence, routeName, userEntity))
        ;
    }
}

ChangeLogs.ACTIONS = ACTIONS;
ChangeLogs.Error = ChangeLogsError;

module.exports = ChangeLogs;
