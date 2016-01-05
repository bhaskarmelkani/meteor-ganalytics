Package.describe({
  summary: "Publish pageviews and events to Google Analytics using the new analytics.js code.",
  version: "0.2.2",
  name: "bhaskarmelkani:ganalytics", 
  git: 'https://github.com/bhaskarmelkani/meteor-ganalytics.git'
});

Package.onUse(function (api) {

  api.addFiles(['ganalytics.js'], 'client');
  
  api.export(['GAnalytics'], 'client');

});