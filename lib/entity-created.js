const _ = require('lodash');
const Promise = require('bluebird');

const ACTIONS = require('./actions');
const ChangeLog = require('./change-log');

class EntityCreated extends ChangeLog {
    static get ACTION() {
        return ACTIONS.ENTITY_CREATED;
    }

    toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        return Promise.resolve()
            .then(() => super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity))
            .then((resource) => _.extend({}, resource, {
                action: "Created",
                from: {
                    label: this.data.label,
                    href: this.href(routeName, domain, this.data.type, this.data.id)
                }
            }))
        ;
    }
}

module.exports = EntityCreated;
