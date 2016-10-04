// Get the account service to use for the user's avatar
// Priority: Twitter > Facebook > Google > GitHub > Instagram > Linkedin
getService = function (user) {
  var services = user && user.services || {};
  if (getCustomUrl(user)) { return 'custom'; }
  var service = _.find([['twitter', 'profile_image_url_https'], ['facebook', 'id'], ['google', 'picture'], ['github', 'username'], ['instagram', 'profile_picture'], ['linkedin', 'pictureUrl']], function(s) { return !!services[s[0]] && s[1].length && !!services[s[0]][s[1]]; });
  if(!service)
    return 'none';
  else
    return service[0];
};

getCustomUrl = function (user) {
  var computeUrl = function(prop) {
    if (typeof prop === 'function') {
      prop = prop.call(user);
    }
    if (prop && typeof prop === 'string') {
      return prop;
    }
  }

  var customProp = user && Avatar.options.customImageProperty;
  if (typeof customProp === 'function') {
    return computeUrl(customProp);
  } else if (customProp) {
    return computeUrl(getDescendantProp(user, customProp));
  }
}

// Returns the size class to use for an avatar
sizeClass = function(context) {
  // Defaults are 'large', 'small', 'extra-small', but user can add new ones
  return Avatar.options.imageSizes[context.size] ? Avatar.getCssClassPrefix() + '-' + context.size : '';
}

// Returns the shape class for an avatar
shapeClass = function (context) {
  var valid = ['rounded', 'circle'];
  return _.contains(valid, context.shape) ? Avatar.getCssClassPrefix() + '-' + context.shape : '';
}

// Returns the custom class(es) for an avatar
customClasses = function (context) {
  return context.class ? context.class : '';
}

// Returns the initials text for an avatar
initialsText = function(user, context) {
  return context.initials || Avatar.getInitials(user);
}

// Creates the dynamically generated CSS file
//
// CSS is dynamically generated so that we can have both a custom class prefix and also allow for custom sizes
createCSS = function () {

  // We only need to do this on the server

  if (!Meteor.isServer)
    return;

  // The base CSS styles

  var p = '.' + Avatar.getCssClassPrefix();
  var a = p + ' ';

  var css =
    p + ' { \n\
      height: 50px; \n\
      width: 50px; \n\
      position: relative; \n\
    } \n' +
    a + p + '-image, \n' +
    a + p + '-initials { \n\
      height: 100%; \n\
      width: 100%; \n\
      position: absolute; \n\
      top: 0px; \n\
      left: 0px; \n\
    } \n' +
    a + p + '-image { \n\
      z-index: 10; \n\
      background-color: #fff; \n\
    } \n' +
    a + p + '-initials { \n\
      display: block; \n\
      background-size: 100% 100%; \n\
      background-color: ' + Avatar.options.backgroundColor + '; \n\
      color: ' + Avatar.options.textColor +'; \n\
      font-size: 25px; \n\
      line-height: 50px; \n\
      font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif; \n\
      text-align: center; \n\
      z-index: 1; \n\
    } \n' +
    p + '-rounded ' + p + '-image, \n' +
    p + '-rounded ' + p + '-initials { \n\
      border-radius: 5px; \n\
    } \n'+
    p + '-circle ' + p + '-image, \n' +
    p + '-circle ' + p + '-initials { \n\
      border-radius: 50%; \n\
    } \n' +
    p + '-hide-image ' + p + '-image { \n\
      display: none; \n\
    } \n' +
    p + '-hide-initials ' + p + '-initials { \n\
      display: none; \n\
    } \n\
  ';

  // CSS for each of the defined sizes

  for (sizeName in Avatar.options.imageSizes) {

    var size = Avatar.options.imageSizes[sizeName];

    css = css + p + '-' + sizeName + ' {' +
      'width: ' + size + 'px; ' +
      'min-width: ' + size + 'px; ' +
      'height: ' + size + 'px;' +
    '}\n' +
    p + '-' + sizeName + ' ' + p + '-initials {' +
      'font-size: ' + size / 2 + 'px; ' +
      'line-height: ' + size + 'px;' +
    '}\n';
  }

  // In order to allow for custom sizes and a custom prefix we need to be able to create a style sheet
  // on the fly. To do this cleanly we use the meteor-hacks:inject package to inject the styles directly
  // into the HTML code before it's sent to the client.

  Inject.rawHead('avatar-styles', '<style>' + css + '</style>');
}
