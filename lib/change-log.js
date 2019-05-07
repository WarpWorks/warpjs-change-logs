const cloneDeep = require('lodash/cloneDeep');
const extend = require('lodash/extend');
const omit = require('lodash/omit');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogsError = require('./error');
// const debug = require('./debug')('change-log');

const STATIC_NAME = 'W2:app:static';

class ChangeLog {
    constructor(user, data, timestamp) {
        this.user = user;
        this.key = data.key;
        this.data = cloneDeep(omit(data, 'key'));
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
        return new this(document.user, extend({}, document.data, { key: document.key }), document.timestamp);
    }

    async toFormResource(domain, persistence, routeName, cacheOfUsers, userEntity) {
        // Hard-coded route name because we always want to see the content user.
        const USER_ROUTE_NAME = 'W2:content:instance';

        const user = await this.getUserResource(domain, persistence, cacheOfUsers, userEntity, USER_ROUTE_NAME);
        return {
            user,
            timestamp: this.timestamp
        };
    }

    async toNotificationJson(persistence, domain) {
        return {
            action: this.constructor.ACTION,
            key: this.key,
            data: cloneDeep(this.data),
            timestamp: this.timestamp,
            user: cloneDeep(this.user)
        };
    }

    async getUserResource(domain, persistence, cacheOfUsers, userEntity, userRouteName) {
        const DEFAULT_IMAGE_URL = `${RoutesInfo.expand(STATIC_NAME, {})}/images/default-user.svg`;

        if (this.user && this.user.id) {
            if (!cacheOfUsers[this.user.id]) {
                const userUrl = RoutesInfo.expand(userRouteName, {
                    domain,
                    type: this.user.type,
                    id: this.user.id
                });

                // User basics.
                const resource = warpjsUtils.createResource(userUrl, {
                    name: this.user.name,
                    username: this.user.username
                });

                cacheOfUsers[this.user.id] = resource;

                // Get the user's image.
                const userId = (this.user.id && this.user.id !== '-1') ? this.user.id : null;
                const userDocuments = userId ? userEntity.getDocuments(persistence, { _id: userId }, true) : [];
                const userDocument = (userDocuments && userDocuments.length) ? userDocuments[0] : null;

                let imageUrl;
                if (userDocument) {
                    // FIXME: Hack not using the model.
                    const overviews = await userEntity.getOverview(persistence, userDocument);
                    const overview = (overviews && overviews.length) ? overviews[0] : null;
                    const images = overview ? overview.Images : null;
                    const image = images && images.length ? images[0] : null;
                    imageUrl = image && image.ImageURL ? image.ImageURL : null;
                }

                imageUrl = imageUrl || DEFAULT_IMAGE_URL;
                cacheOfUsers[this.user.id].link('thumbnail', imageUrl);
            }

            return cacheOfUsers[this.user.id];
        } else {
            // The old change logs didn't have the user.id, so it's impossible
            // to link them to the correct user (think about 2 users with the
            // same name). We cannot unmistakenly link with the username because
            // a username could have been created, deleted, and created a new
            // one with the same username.
            const resource = warpjsUtils.createResource('', {
                name: this.user.name,
                username: this.user.username
            });
            resource.link('thumbnail', DEFAULT_IMAGE_URL);

            return resource;
        }
    }

    toJSON() {
        return Object.freeze({
            user: Object.freeze(cloneDeep(this.user)),
            action: this.constructor.ACTION,
            key: this.key,
            data: Object.freeze(cloneDeep(this.data)),
            timestamp: this.timestamp
        });
    }

    href(routeName, domain, type, id) {
        return RoutesInfo.expand(routeName, { domain, type, id });
    }
}

module.exports = ChangeLog;
