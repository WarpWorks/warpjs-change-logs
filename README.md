# WarpJS ChangeLogs

This package allows to add change logs to a WarpJS document.

## Setup

    npm install --save @warp-works/warpjs-change-logs

## Usage

    const ChangeLogs = require('@warp-works/warpjs-change-logs');

    // get the instance
    ChangeLogs.add(action, user, instance, data)
    // save instance

    const resource = ChangeLogs.toFormResource(instance, domain, persistence, routeName, userEntity);

## API

### .ACTIONS

Object containing list of available actions. Also see issue #1.

### .ChangeLogsError

Error thrown if any issue.

### .add(action, user, instance, data)

Adds a new change log. This will modify `instance` in-place and will return
`instance` so it will be easy to chain operations if desired.

    Promise.resolve()
      .then(() => somethingToGetInstance(persistence))
      .then((instance) => ChangeLogs.add(
        ChangeLogs.ACTIONS.UPDATE_VALUE, // action
        { id: 1, type: 'User', Name: 'John Doe', UserName: 'jdoe' }, // user
        instance,
        { key: 'Basic:Name', oldValue: 'Jhon Doe', newValue: 'John Doe' } // data
      ))
      .then((instance) => somethingToSave(persistence, instance))
      ...

Parameters:

- `action`: For available actions, see [ACTIONS](lib/actions.js). But also
  consider issue #1.
- `user`: Object representation of the user. It should have the form of
  `{ id, type, Name, UserName }`.
- `instance`: Document instance.
- `data`: Object to be saved in the change logs. It usually has the form of
  `{ key, label, type, id }`, but refer to individual action to see what it
  expects.


### .toFormResource(domain, persistence, routeName, userEntity)

Builds an array of change logs resources. This can then be embedded into an HAL
resource.

    const resource = ...hal...;
    Promise.resolve()
      .then(() => ChangeLogs.toFormResource('a', persistence, 'my:route', userEntity))
      .then((changeLogs) => resource.embed('changeLogs', changeLogs))
    ;

Parameters:

- `domain`: Domain name.
- `persistence`: Persistence instance.
- `routeName`: Name of the route to use from
  [`RoutesInfo`](https://www.npmjs.com/package/@quoin/expressjs-routes-info). It
  will pass in `{domain, type, id}`. `type` and `id` are taken from the `data`
  that was passed in when used `.add()` above.
- `userEntity`: The `User` entity that will be used to retrieve the display
  picture.
