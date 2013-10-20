/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        backboneDualstorage: {
            deps: ['underscore', 'backbone'],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        backboneDualstorage: 'vendor/backbone-dualstorage'
    }
});

require([
    'backbone',
    'collections/tweets',
    'views/app'
], function (Backbone, TweetsCollection, AppView) {

    var tweets = new TweetsCollection();

    var app = new AppView({collection: tweets});

    // for debugging.
    window.app = app;
});
