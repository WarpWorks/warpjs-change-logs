const _ = require('lodash');
const Promise = require('bluebird');

const ACTIONS = require('./actions');
const ChangeLog = require('./change-log');
const shorten = require('./shorten');

class UpdateValue extends ChangeLog {
    static get ACTION() {
        return ACTIONS.UPDATE_VALUE;
    }

    toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        return Promise.resolve()
            .then(() => super.toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity))
            .then((resource) => _.extend({}, resource, {
                action: "Changed property",
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
            }))
        ;
    }
}

module.exports = UpdateValue;
