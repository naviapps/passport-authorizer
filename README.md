# passport-authorizer

## Install

```bash
$ npm install passport-authorizer
```

## Usage

```js
passport.use(new AuthorizerStrategy(
  function (authorizer, done) {
    User.findById(authorizer.principalId, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      done(err, user);
    });
  }
));
```
#### Parameters

By default, `AuthorizerStrategy` expects to find authorizer in parameters named reqPropKey. If your site prefers to name these fields differently, options are available to change the defaults.

```js
passport.use(new AuthorizerStrategy({
    reqPropKey: 'apiGateway',
    session: false
  },
  function (authorizer, done) {
    // ...
  }
));
```

When session support is not necessary, it can be safely disabled by setting the session option to false.

The verify callback can be supplied with the `request` object by setting the `passReqToCallback` option to true, and changing callback arguments accordingly.

```js
passport.use(new AuthorizerStrategy({
    reqPropKey: 'apiGateway',
    passReqToCallback: true,
    session: false
  },
  function (req, authorizer, done) {
    // request object is now first argument
    // ...
  }
));
```

#### Authenticate Requests

```js
app.get('/private', 
  passport.authenticate('authorizer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
```
