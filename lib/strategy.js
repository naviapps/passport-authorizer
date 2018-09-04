'use strict';
/**
 * Module dependencies.
 */
const util = require('util');
const passport = require('passport-strategy');

/**
 * `Strategy` constructor.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `reqPropKey`  aws-serverless-express/middleware options.reqPropKey, defaults to _apiGateway_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Example
 *
 *     passport.use(new AuthorizerStrategy(
 *       function (authorizer, done) {
 *         User.findById(authorizer.principalId, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 *     passport.use(new AuthorizerStrategy(
 *       function (authorizer, done) {
 *         User.findOne({ username: authorizer.claims.sub }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) throw new TypeError('AuthorizerStrategy requires a verify callback');

  this._reqPropKey = options.reqPropKey || 'apiGateway';

  passport.Strategy.call(this);
  this.name = 'authorizer';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a authorizer parameters.
 *
 * @param {Object} req
 * @param options
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
  options = options || {};
  const reqPropKey = this._reqPropKey;
  const authorizer = req[reqPropKey].event.requestContext.authorizer;

  if (!authorizer) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }

  const self = this;

  function verified(err, user, info) {
    if (err) return self.error(err);
    if (!user) return self.fail(info);
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, authorizer, verified);
    } else {
      this._verify(authorizer, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
