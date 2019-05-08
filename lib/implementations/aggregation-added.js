const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');

class AggregationAdded extends ChangeLog {
    static get ACTION() {
        return ACTIONS.AGGREGATION_ADDED;
    }

    static get ACTION_LABEL() {
        return "Created child";
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);

        return extend({}, resource, {
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

    async toNotificationJson(persistence, domain) {
        const json = await super.toNotificationJson(persistence, domain);
        json.value = {
            label: "NEW",
            href: this.href('entity', domain, this.data.type, this.data.id) // FIXME
        };
        return json;
    }
}

module.exports = AggregationAdded;
