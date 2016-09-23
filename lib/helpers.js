export const loginButtonsSession = Accounts._loginButtonsSession;

export const STATES = {
  SIGN_IN: Symbol('SIGN_IN'),
  SIGN_UP: Symbol('SIGN_UP'),
  PROFILE: Symbol('PROFILE'),
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),
  PASSWORD_RESET: Symbol('PASSWORD_RESET')
};

export function getLoginServices() {
  // First look for OAuth services.
  const services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

  // Be equally kind to all login services. This also preserves
  // backwards-compatibility.
  services.sort();

  return _.map(services, (name) => ({ name }));
}

// Export getLoginServices as a global
// because accounts-base requires it.
this.getLoginServices = getLoginServices;

export function hasPasswordService() {
  // First look for OAuth services.
  return !!Package['accounts-password'];
}

export function loginResultCallback(service) {
  if (Meteor.isClient) {
    if (typeof redirect === 'string') {
      window.location.href = '/';
    }

    if (typeof service === 'function') {
      service();
    }
  }
}

export function passwordSignupFields() {
  return Accounts.UI._options.passwordSignupFields || 'EMAIL_ONLY_NO_PASSWORD';
}

export function validatePassword(password) {
  return password.length >= Accounts.UI._options.minimumPasswordLength;
}

export function redirect(routePath) {
  if (Meteor.isClient) {
    if (window.history) {
      Meteor.setTimeout(() => {
        if (Package['kadira:flow-router']) {
          Package['kadira:flow-router'].FlowRouter.go(routePath);
        } else if (Package['kadira:flow-router-ssr']) {
          Package['kadira:flow-router-ssr'].FlowRouter.go(routePath);
        } else {
          window.history.pushState({}, 'redirect', routePath);
        }
      }, 500);
    }
  }
}

export function capitalize(string) {
  return string.replace(/\-/, ' ').split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
