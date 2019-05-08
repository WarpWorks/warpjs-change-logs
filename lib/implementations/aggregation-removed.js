const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AggregationRemoved extends ChangeLog {
    static get ACTION() {
        return ACTIONS.AGGREGATION_REMOVED;
    }

    static get ACTION_LABEL() {
        return "Removed child";
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            element: {
                label: this.key,
                help: this.key
            },
            value: {
                label: this.data.label
            }
        });
    }

    async toNotificationJson(persistence, domain) {
        const json = await super.toNotificationJson(persistence, domain);
        json.value = {
            label: this.data.label
        };
        return json;
    }
}
module.exports = AggregationRemoved;
