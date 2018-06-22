const _ = require('lodash');
const Promise = require('bluebird');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');
const shorten = require('./../shorten');

class EmbeddedAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.EMBEDDED_ADDED;
    }

    toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        return Promise.resolve()
            .then(() => super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity))
            .then((resource) => _.extend({}, resource, {
                action: "Added new embedded",
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                    help: this.key
                }
            }))
        ;
    }
}

module.exports = EmbeddedAdded;
