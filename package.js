Package.describe({
  name: "utilities:avatar",
  summary: "Consolidated user avatar template (twitter, facebook, gravatar, etc.)",
  version: "0.9.2",
  git: "https://github.com/meteor-utilities/avatar"
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.4.1', 'METEOR@1.1.0.1']);
  api.use(['templating', 'reactive-var'], ['client']);
  api.use(['underscore'], ['client', 'server']);
  api.use(['meteorhacks:inject-initial@1.0.4-rc.0'], ['server']);

  api.addFiles(
    [
      'blaze/avatar.html',
      'blaze/avatar.js',
    ],
    ['client']
  );
  api.addFiles(
    [
      // 'react/avatar.jsx',
      'utils.js',
      'helpers.js',
      'export.js'
    ],
    ['client', 'server']
  );

  api.addAssets(
    [
    'default.png'
    ],
    ['client', 'server']
  );

  api.export('Avatar');
});
