const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AggregationRemoved extends ChangeLog {
    static get ACTION() {
        return ACTIONS.AGGREGATION_REMOVED;
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            action: "Removed child",
            element: {
                label: this.key,
                help: this.key
            },
            value: {
                label: this.data.label
            }
        });
    }
}
module.exports = AggregationRemoved;
