Package.describe({
  name: 'jeremy:react-accounts-ui',
  version: '2.0.0',
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
    'softwarerero:accounts-t9n',
    'fourseven:scss@3.10.0'
  ]);

  api.use('accounts-oauth', { weak: true });
  api.use('accounts-password', { weak: true });

  api.imply([
    'accounts-base',
    'softwarerero:accounts-t9n@1.3.5'
  ]);

  api.addFiles('lib/ui/styles.scss', 'client');

  api.mainModule('lib/client.js', 'client');
  api.mainModule('lib/server.js', 'server');
});
