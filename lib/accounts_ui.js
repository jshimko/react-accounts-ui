import _ from 'lodash';
import { Accounts } from 'meteor/accounts-base';
import * as UI from './ui/components';
import { redirect } from './helpers';

/**
 * @summary Accounts UI components and methods
 * @namespace Accounts.UI
 * @memberOf Accounts
 */

// extend Accounts with the React UI components
Accounts.UI = UI;

// define defaults
Accounts.UI._options = {
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
  minimumPasswordLength: 7,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homeRoutePath: '/',
  onSubmitHook: () => {},
  onPreSignUpHook: () => new Promise(resolve => resolve()),
  onPostSignUpHook: () => {},
  onEnrollAccountHook: () => redirect(`${Accounts.UI._options.loginPath}`),
  onResetPasswordHook: () => redirect(`${Accounts.UI._options.loginPath}`),
  onVerifyEmailHook: () => redirect(`${Accounts.UI._options.profilePath}`),
  onSignedInHook: () => null,
  onSignedOutHook: () => null
};

/**
 * Configure the behavior of the LoginForm component
 * @param {Object} options - options object
 * @param {Object} options.requestPermissions Which permissions to request from the user for each external service.
 * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline
 * @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions
 * @param {String} options.passwordSignupFields Which fields to display in the user creation form.
 * @return {Object} return the final configuration
 */
Accounts.UI.config = function (options = {}) {
  // validate options keys
  const VALID_KEYS = [
    'passwordSignupFields',
    'requestPermissions',
    'requestOfflineToken',
    'forbidClientAccountCreation',
    'requireEmailVerification',
    'minimumPasswordLength',
    'loginPath',
    'signUpPath',
    'resetPasswordPath',
    'profilePath',
    'changePasswordPath',
    'homeRoutePath',
    'onSubmitHook',
    'onPreSignUpHook',
    'onPostSignUpHook',
    'onEnrollAccountHook',
    'onResetPasswordHook',
    'onVerifyEmailHook',
    'onSignedInHook',
    'onSignedOutHook'
  ];

  Object.keys(options).forEach((key) => {
    if (!_.includes(VALID_KEYS, key)) {
      throw new Error(`Accounts.UI.config: Invalid option: ${key}`);
    }
  });

  const passwordSignupFields = [
    'USERNAME_AND_EMAIL',
    'USERNAME_AND_OPTIONAL_EMAIL',
    'USERNAME_ONLY',
    'EMAIL_ONLY',
    'EMAIL_ONLY_NO_PASSWORD',
    'USERNAME_AND_EMAIL_NO_PASSWORD'
  ];

  // deal with `passwordSignupFields`
  if (options.passwordSignupFields) {
    if (_.includes(passwordSignupFields, options.passwordSignupFields)) {
      Accounts.UI._options.passwordSignupFields = options.passwordSignupFields;
    } else {
      throw new Error(`Accounts.UI.config: Invalid option for 'passwordSignupFields': ${options.passwordSignupFields}`);
    }
  }

  // deal with `requestPermissions`
  if (options.requestPermissions) {
    _.each(options.requestPermissions, (scope, service) => {
      if (Accounts.UI._options.requestPermissions[service]) {
        throw new Error(`Accounts.UI.config: Can\'t set "requestPermissions" more than once for ${service}`);
      } else if (!Array.isArray(scope)) {
        throw new Error('Accounts.UI.config: Value for "requestPermissions" must be an array');
      } else {
        Accounts.UI._options.requestPermissions[service] = scope;
      }
    });
  }

  // deal with `requestOfflineToken`
  if (options.requestOfflineToken) {
    _.each(options.requestOfflineToken, (value, service) => {
      if (service !== 'google') {
        throw new Error('Accounts.UI.config: "requestOfflineToken" only supported for Google login at the moment.');
      }

      if (Accounts.UI._options.requestOfflineToken[service]) {
        throw new Error(`Accounts.UI.config: Can't set "requestOfflineToken" more than once for ${service}`);
      } else {
        Accounts.UI._options.requestOfflineToken[service] = value;
      }
    });
  }

  // deal with `forceApprovalPrompt`
  if (options.forceApprovalPrompt) {
    _.each(options.forceApprovalPrompt, (value, service) => {
      if (service !== 'google') {
        throw new Error('Accounts.UI.config: `forceApprovalPrompt` only supported for Google login at the moment.');
      }

      if (Accounts.UI._options.forceApprovalPrompt[service]) {
        throw new Error(`Accounts.UI.config: Can\'t set "forceApprovalPrompt" more than once for ${service}`);
      } else {
        Accounts.UI._options.forceApprovalPrompt[service] = value;
      }
    });
  }

  // deal with `requireEmailVerification`
  if (options.requireEmailVerification) {
    if (typeof options.requireEmailVerification !== 'boolean') {
      throw new Error('Accounts.UI.config: "requireEmailVerification" not a boolean');
    } else {
      Accounts.UI._options.requireEmailVerification = options.requireEmailVerification;
    }
  }

  // deal with `minimumPasswordLength`
  if (options.minimumPasswordLength) {
    if (typeof options.minimumPasswordLength !== 'number') {
      throw new Error('Accounts.UI.config: "minimumPasswordLength" not a number');
    } else {
      Accounts.UI._options.minimumPasswordLength = options.minimumPasswordLength;
    }
  }

  const routePaths = [
    'loginPath',
    'signUpPath',
    'resetPasswordPath',
    'profilePath',
    'changePasswordPath',
    'homeRoutePath'
  ];

  // deal with the paths.
  for (const path of routePaths) {
    if (options[path]) {
      if (typeof options[path] !== 'string') {
        throw new Error(`Accounts.UI.config: ${path} is not a string`);
      } else {
        Accounts.UI._options[path] = options[path];
      }
    }
  }

  const submitHooks = [
    'onSubmitHook',
    'onPreSignUpHook',
    'onPostSignUpHook'
  ];

  // deal with the hooks.
  for (const hook of submitHooks) {
    if (options[hook]) {
      if (typeof options[hook] !== 'function') {
        throw new Error(`Accounts.UI.config: "${hook}" not a function`);
      } else {
        Accounts.UI._options[hook] = options[hook];
      }
    }
  }

  const redirectHooks = [
    'onEnrollAccountHook',
    'onResetPasswordHook',
    'onVerifyEmailHook',
    'onSignedInHook',
    'onSignedOutHook'
  ];

  // deal with redirect hooks.
  for (const hook of redirectHooks) {
    if (options[hook]) {
      if (typeof options[hook] === 'function') {
        Accounts.UI._options[hook] = options[hook];
      } else if (typeof options[hook] === 'string') {
        Accounts.UI._options[hook] = () => redirect(options[hook]);
      } else {
        throw new Error(`Accounts.UI.config: "${hook}" not a function or an absolute or relative path`);
      }
    }
  }

  // return the final configuration
  return Accounts.UI._options;
};

// backward compat
Accounts.ui = Accounts.UI;

export default Accounts;
