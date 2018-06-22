const Promise = require('bluebird');

const IMPLEMENTATIONS = require('./implementations');

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
}

module.exports = ChangeLogs;
