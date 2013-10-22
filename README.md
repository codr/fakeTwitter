fakeTwitter
===========

This app uses Yeoman and Backbone.js to display fake tweets. It stores these tweets in the browsers localstorage and will diplay the most voted tweets at the top.

`lib/fakeStorage.js` is a monkey patched version of `backbone.localStorage.js`. It doesn't actually store anything it just returns a random tweet from `lib/fakeTweets.js`.

View the app here: http://codr.github.io/fakeTwitter/



TODO:
    - there seem to be a race condition on dev where the app ignore localStorage and builds new data. I believe this is related to `collections/tweet.js` and how it uses `vendor/backbone-dualstorage`