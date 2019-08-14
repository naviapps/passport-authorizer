# passport-authorizer

[Passport](http://passportjs.org/) strategy for authenticating with a API Gateway Lambda Authorizer.

## Install

```bash
$ npm install aws-serverless-express passport-authorizer
```

or

```bash
$ yarn add aws-serverless-express passport-authorizer
```

## Usage

#### Configure Strategy

```js
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AuthorizerStrategy = require('passport-authorizer');

app.use(awsServerlessExpressMiddleware.eventContext());

passport.use(new AuthorizerStrategy(
  function (authorizer, done) {
    User.findOne({ username: authorizer.principalId }, function (err, user) {
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

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present Navi Apps, Inc.
