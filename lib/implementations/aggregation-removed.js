const _ = require('lodash');
const Promise = require('bluebird');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AggregationRemoved extends ChangeLog {
    static get ACTION() {
        return ACTIONS.AGGREGATION_REMOVED;
    }

    toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        return Promise.resolve()
            .then(() => super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity))
            .then((resource) => _.extend({}, resource, {
                action: "Removed child",
                element: {
                    label: this.key,
                    help: this.key
                },
                value: {
                    label: this.data.label
                }
            }))
        ;
    }
}
module.exports = AggregationRemoved;
