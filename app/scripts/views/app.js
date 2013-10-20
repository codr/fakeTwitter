/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/tweet'
], function ($, _, Backbone, JST, TweetView) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $('#twitterApp'),

        events: {
            'click #load-more':     'loadMore',
        },

        template: JST['app/scripts/templates/app.ejs'],

        initialize: function() {

            this.tweets = this.$('#tweets');

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'change:votes', this.reorder);
            this.listenTo(this.collection, 'sort', this.render);
            // this.listenTo(this.collection, 'all', function() {console.log(arguments);});

            this.collection.fetch({
                remote: false,
                success: function() {
                    if (this.isEmpty()) {
                        this.fetch({remote: true});
                    }
                }.bind(this.collection),
            });

        },

        loadMore: function() {
            this.collection.fetch({remove: false, add: true});
        },

        addOne: function(tweet) {
            var view = new TweetView({model: tweet});
            this.tweets.append(view.render().el);
        },

        // Can be made more efficient by manipulating the DOM nodes
        // instead of recreating them every time.
        render: function() {
            this.tweets.empty();
            this.collection.each(this.addOne, this);
        },

        reorder: function() {
            this.collection.sort();
        },
    });

    return AppView;
});