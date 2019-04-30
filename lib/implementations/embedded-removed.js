const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');
const shorten = require('./../shorten');

class EmbeddedRemoved extends ChangeLog {
    static get ACTION() {
        return ACTIONS.EMBEDDED_REMOVED;
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            action: "Removed embedded",
            element: {
                label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                help: this.key
            }
        });
    }
}

module.exports = EmbeddedRemoved;
