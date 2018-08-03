const _ = require('lodash');
// const debug = require('debug')('W2:ChangeLogs:lib/change-log');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogsError = require('./error');

class ChangeLog {
    constructor(user, data, timestamp) {
        this.user = user;
        this.key = data.key;
        delete data.key;
        this.data = _.cloneDeep(data);
        this.timestamp = timestamp || (new Date()).toISOString();
    }

    // This is used instead of the ChangeLog.ACTION = 'something' because it
    // would return `undefined` instead of crashing and inform us that we missed
    // this setting.
    static get ACTION() {
        throw new ChangeLogsError(`Not implemented 'static get ${this.name}.ACTION()'.`);
    }

    static fromDocument(document) {
        // debug(`${this.name}.fromDocument(): document=`, document);
        return new this(document.user, _.extend({}, document.data, { key: document.key }), document.timestamp);
    }

    toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        return Promise.resolve()
            .then(() => this.getUserResource(domain, persistence, cacheOfUsers, userEntity))
            .then((user) => ({
                user,
                timestamp: this.timestamp
            }))
        ;
    }

    getUserResource(domain, persistence, cacheOfUsers, userEntity) {
        // Hard-coded route name because we always want to see the content user.
        const USER_ROUTE_NAME = 'W2:content:instance';
        const STATIC_NAME = 'W2:app:static';
        const DEFAULT_IMAGE_URL = `${RoutesInfo.expand(STATIC_NAME)}/images/default-user.svg`;

        if (this.user && this.user.id) {
            return Promise.resolve()
                .then(() => {
                    if (!cacheOfUsers[this.user.id]) {
                        return Promise.resolve()

                            // User basics.
                            .then(() => RoutesInfo.expand(USER_ROUTE_NAME, {
                                domain,
                                type: this.user.type,
                                id: this.user.id
                            }))
                            .then((userUrl) => warpjsUtils.createResource(userUrl, {
                                name: this.user.name,
                                username: this.user.username
                            }))
                            .then((resource) => {
                                cacheOfUsers[this.user.id] = resource;
                            })

                            // Get the user's image.
                            .then(() => (this.user.id && this.user.id !== '-1') ? this.user.id : null)
                            .then((userId) => userId ? userEntity.getDocuments(persistence, { _id: userId }, true) : [])
                            .then((userDocuments) => (userDocuments && userDocuments.length) ? userDocuments[0] : null)
                            .then((userDocument) => userDocument
                                ? Promise.resolve()
                                    // FIXME: Hack not using the model.
                                    .then(() => userEntity.getOverview(persistence, userDocument))
                                    .then((overviews) => (overviews && overviews.length) ? overviews[0] : null)
                                    .then((overview) => overview ? overview.Images : null)
                                    .then((images) => images && images.length ? images[0] : null)
                                    .then((image) => image && image.ImageURL ? image.ImageURL : null)
                                : null
                            )
                            .then((imageUrl) => imageUrl || DEFAULT_IMAGE_URL)
                            .then((imageUrl) => cacheOfUsers[this.user.id].link('thumbnail', imageUrl))
                        ;
                    }
                })
                .then(() => cacheOfUsers[this.user.id])
            ;
        } else {
            // The old change logs didn't have the user.id, so it's impossible
            // to link them to the correct user (think about 2 users with the
            // same name). We cannot unmistakenly link with the username because
            // a username could have been created, deleted, and created a new
            // one with the same username.
            return Promise.resolve()
                .then(() => warpjsUtils.createResource('', {
                    name: this.user.name,
                    username: this.user.username
                }))
                .then((resource) => {
                    resource.link('thumbnail', DEFAULT_IMAGE_URL);
                    return resource;
                })
            ;
        }
    }

    toJSON() {
        return Object.freeze({
            user: Object.freeze(_.clone(this.user)),
            action: this.constructor.ACTION,
            key: this.key,
            data: Object.freeze(_.cloneDeep(this.data)),
            timestamp: this.timestamp
        });
    }

    href(routeName, domain, type, id) {
        return RoutesInfo.expand(routeName, { domain, type, id });
    }
}

module.exports = ChangeLog;
