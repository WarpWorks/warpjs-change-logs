const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class EntityCreated extends ChangeLog {
    static get ACTION() {
        return ACTIONS.ENTITY_CREATED;
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            action: "Created",
            from: {
                label: this.data.label,
                href: this.href(routeName, domain, this.data.type, this.data.id)
            }
        });
    }
}

module.exports = EntityCreated;
