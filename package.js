Package.describe({
  name: 'jeremy:react-accounts-ui',
  version: '0.1.0',
  summary: 'React UI for Meteor Accounts',
  git: 'https://github.com/jshimko/react-accounts-ui',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'tracker',
    'underscore',
    'accounts-base',
    'check',
    'random',
    'email',
    'session',
    'softwarerero:accounts-t9n'
  ]);

  api.use('accounts-oauth', { weak: true });
  api.use('accounts-password', { weak: true });

  api.imply([
    'accounts-base',
    'softwarerero:accounts-t9n@1.3.3'
  ]);

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
