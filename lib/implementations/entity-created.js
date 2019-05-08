const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class EntityCreated extends ChangeLog {
    static get ACTION() {
        return ACTIONS.ENTITY_CREATED;
    }

    static get ACTION_LABEL() {
        return "Created";
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            from: {
                label: this.data.label,
                href: this.href(routeName, domain, this.data.type, this.data.id)
            }
        });
    }

    async toNotificationJson(persistence, domain) {
        const json = await super.toNotificationJson(persistence, domain);
        json.from = {
            label: this.data.label,
            href: this.href('entity', domain, this.data.type, this.data.id) // FIXME
        };
        return json;
    }
}

module.exports = EntityCreated;
