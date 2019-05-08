const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AssociationAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.ASSOCIATION_ADDED;
    }

    static get ACTION_LABEL() {
        return "Added association";
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            element: {
                label: this.key,
                help: this.key
            },
            value: {
                label: this.data.label,
                href: this.href(routeName, domain, this.data.type, this.data.id)
            }
        });
    }

    async toNotificationJson(persistence, domain) {
        const json = await super.toNotificationJson(persistence, domain);
        json.value = {
            label: this.data.label,
            href: this.href('entity', domain, this.data.type, this.data.id) // FIXME
        };
        return json;
    }
}

module.exports = AssociationAdded;
