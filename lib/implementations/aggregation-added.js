const _ = require('lodash');
const Promise = require('bluebird');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AggregationAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.AGGREGATION_ADDED;
    }

    toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        return Promise.resolve()
            .then(() => super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity))
            .then((resource) => _.extend({}, resource, {
                action: "Created child",
                element: {
                    label: this.key,
                    help: this.key
                },
                value: {
                    label: "NEW",
                    href: this.href(routeName, domain, this.data.type, this.data.id)
                }
            }))
        ;
    }
}

module.exports = AggregationAdded;
