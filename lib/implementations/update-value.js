const extend = require('lodash/extend');

const ACTIONS = require('./../actions');
const ChangeLog = require('./../change-log');
const shorten = require('./../shorten');

class UpdateValue extends ChangeLog {
    static get ACTION() {
        return ACTIONS.UPDATE_VALUE;
    }

    static get ACTION_LABEL() {
        return "Changed property";
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        const resource = await super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity);
        return extend({}, resource, {
            element: {
                label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                help: this.key
            },
            fromTo: {
                fromValue: shorten(this.data.oldValue),
                fromHelp: this.data.oldValue,
                fromClass: (this.key === 'Enum:Status') ? `warpjs-document-status warpjs-document-status-${this.data.oldValue}` : '',
                toValue: shorten(this.data.newValue),
                toHelp: this.data.newValue,
                toClass: (this.key === 'Enum:Status') ? `warpjs-document-status warpjs-document-status-${this.data.newValue}` : ''
            },
            isEnumeration: Boolean(this.key && this.key.substr(0, 5) === 'Enum:')
        });
    }

    async toNotificationJson(persistence, domain) {
        const json = await super.toNotificationJson(persistence, domain);
        json.key = shorten(this.key, undefined, true);
        json.data.newClass = (this.key === 'Enum:Status') ? `warpjs-document-status warpjs-document-status-${this.data.newValue}` : '';
        json.data.fromClass = (this.key === 'Enum:Status') ? `warpjs-document-status warpjs-document-status-${this.data.oldValue}` : '';
        return json;
    }
}

module.exports = UpdateValue;
