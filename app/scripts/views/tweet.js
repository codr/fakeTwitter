/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var TweetView = Backbone.View.extend({

        tagName: 'div',

        events: {
            'click .vote':  'vote',
            'click .close': 'destroy',
        },

        template: JST['app/scripts/templates/tweet.ejs'],

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        vote: function() {
            this.model.vote();
        },

        destroy: function() {
            this.model.destroy();
        },
    });

    return TweetView;
});