const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

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

    async toFormResource(domain, persistence, routeName, userEntity) {
        const history = this.toJSON();
        history.reverse();

        const cacheOfUsers = {};

        return Promise.map(
            history,
            async (changeLogDocument) => {
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

    async toNotificationResource(persistence, domain) {
        const history = this.toJSON();
        history.reverse();

        const href = RoutesInfo.expand('entity', {
            type: this.instance.type,
            id: this.instance.id
        });

        const items = await Promise.map(
            history,
            async (changeLogJson) => {
                const ChangeLog = IMPLEMENTATIONS[changeLogJson.action];
                if (!ChangeLog) {
                    return null;
                }

                const changeLog = ChangeLog.fromDocument(changeLogJson);
                return changeLog.toNotificationJson(persistence, domain);
            },
            { concurrency: 1 }
        );

        const resource = warpjsUtils.createResource(href, {
            type: this.instance.type,
            typeID: this.instance.typeID,
            id: this.instance.id,
            name: domain.getDisplayName(this.instance),
            items
        });

        return resource;
    }
}

module.exports = ChangeLogs;
