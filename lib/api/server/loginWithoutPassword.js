import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';


Meteor.methods({

  loginWithoutPassword({ email, username }) {
    let address;

    if (username) {
      check(username, String);

      const user = Meteor.users.findOne({
        $or: [{
          'username': username,
          'emails.address': { $exists: 1 }
        }, {
          'emails.address': email
        }]
      });

      if (!user) {
        throw new Meteor.Error('not-found', 'User not found');
      }

      address = user.emails[0].address;
    } else {
      check(email, String);

      const user = Meteor.users.findOne({ 'emails.address': email });

      if (!user) {
        throw new Meteor.Error('not-found', 'User not found');
      }
    }

    if (Accounts.UI._options.requireEmailVerification) {
      if (!user.emails[0].verified) {
        throw new Meteor.Error('email-not-verified', 'Email not verified');
      }
    }

    Accounts.sendLoginEmail(user._id, address || email);
  }
});


/**
 * @summary Send an email with a link the user can use to verify their email address.
 * @param {String} userId The id of the user to send email to.
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
 */
Accounts.sendLoginEmail = function (userId, address) {
  // XXX Also generate a link using which someone can delete this
  // account if they own said address but weren't those who created
  // this account.

  // Make sure the user exists, and address is one of their addresses.
  const user = Meteor.users.findOne(userId);

  if (!user) {
    throw new Error('Can\'t find user');
  }

  // pick the first unverified address if we weren't passed an address.
  if (!address) {
    const email = _.find(user.emails || [], (e) => !e.verified);
    address = (email || {}).address;
  }

  // make sure we have a valid address
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)) {
    throw new Error('No such email address for user.');
  }

  const tokenRecord = {
    token: Random.secret(),
    address: address,
    when: new Date()
  };

  Meteor.users.update({ _id: userId }, {
    $push: {
      'services.email.verificationTokens': tokenRecord
    }
  });

  // before passing to template, update user object with new token
  Meteor._ensure(user, 'services', 'email');

  if (!user.services.email.verificationTokens) {
    user.services.email.verificationTokens = [];
  }

  user.services.email.verificationTokens.push(tokenRecord);

  const loginUrl = Accounts.urls.verifyEmail(tokenRecord.token);

  const options = {
    to: address,
    from: Accounts.emailTemplates.loginNoPassword.from ?
        Accounts.emailTemplates.loginNoPassword.from(user)
      : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.loginNoPassword.subject(user)
  };

  if (typeof Accounts.emailTemplates.loginNoPassword.text === 'function') {
    options.text = Accounts.emailTemplates.loginNoPassword.text(user, loginUrl);
  }

  if (typeof Accounts.emailTemplates.loginNoPassword.html === 'function') {
    options.html = Accounts.emailTemplates.loginNoPassword.html(user, loginUrl);
  }

  if (typeof Accounts.emailTemplates.headers === 'object') {
    options.headers = Accounts.emailTemplates.headers;
  }

  Email.send(options);
};

// Check for installed accounts-password dependency.
if (Accounts.emailTemplates) {
  Accounts.emailTemplates.loginNoPassword = {
    subject() {
      return 'Login on ' + Accounts.emailTemplates.siteName;
    },
    text(user, url) {
      const greeting = (user.profile && user.profile.name) ?
            ('Hello ' + user.profile.name + ',') : 'Hello,';
      return `${greeting}
To login, simply click the link below.
${url}
Thanks.
`;
    }
  };
}
