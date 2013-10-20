/*global define*/

define([
    'underscore',
    'backbone',
    'models/tweet',
    'lib/fakeStorage',
    'vendor/backbone-dualstorage',
], function (_, Backbone, TweetModel, FakeStorage) {
    'use strict';

    var TweetsCollection = Backbone.Collection.extend({

        model: TweetModel,

        fakeStorage: new FakeStorage(),

        url: '/tweets/get',

        comparator: function(model) {
            // reverse the order.
            return model.get('votes') * -1;
        }
    });

    return TweetsCollection;
});