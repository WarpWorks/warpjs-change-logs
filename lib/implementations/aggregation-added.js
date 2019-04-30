const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AggregationAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.AGGREGATION_ADDED;
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);

        return extend({}, resource, {
            action: "Created child",
            element: {
                label: this.key,
                help: this.key
            },
            value: {
                label: "NEW",
                href: this.href(routeName, domain, this.data.type, this.data.id)
            }
        });
    }
}

module.exports = AggregationAdded;
