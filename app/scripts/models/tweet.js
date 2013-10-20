/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var TweetModel = Backbone.Model.extend({

        defaults: {
            tweet: 'This is a default tweet.',
            date: new Date(),
            votes: 0,
        },

        // prevent backbone.dualstorage from marking the
        // sotrage as dirty when updating.
        local: true,

        vote: function() {
            this.save('votes', this.get('votes') + 1);
        }
    });

    return TweetModel;
});