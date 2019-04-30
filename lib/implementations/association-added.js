const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AssociationAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.ASSOCIATION_ADDED;
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            action: "Added association",
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
}

module.exports = AssociationAdded;
