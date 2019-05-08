const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');
const shorten = require('./../shorten');

class EmbeddedAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.EMBEDDED_ADDED;
    }

    static get ACTION_LABEL() {
        return "Added new embedded";
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            element: {
                label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                help: this.key
            }
        });
    }

    async toNotificationJson(persistence, domain) {
        const json = await super.toNotificationJson(persistence, domain);
        return json;
    };
}

module.exports = EmbeddedAdded;
