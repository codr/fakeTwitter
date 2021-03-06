/*global define*/

define([
    'underscore',
    'backbone',
    'lib/fakeTweets'
], function(_, Backbone, FakeTweets) {
    'use strict';
    // A simple module to replace `Backbone.sync` with *fakeStorage*-based
    // persistence. Models are given GUIDS, and saved into a JSON object. Simple
    // as that.

    // Hold reference to Underscore.js and Backbone.js in the closure in order
    // to make things work even if they are removed from the global namespace

    // Generate four random hex digits.
    function S4() {
        return (((1+Math.random())*0x10000)).toString(16).substring(1);
    }

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
    }

    // Our Store is represented by a single JS object in *fakeStorage*. Create it
    // with a meaningful name, like the name you'd give a table.
    // window.Store is deprectated, use Backbone.fakeStorage instead
    Backbone.fakeStorage = window.Store = function() {};

    _.extend(Backbone.fakeStorage.prototype, {

        // Save the current state of the **Store** to *fakeStorage*.
        save: function() {
            this.fakeStorage().setItem(this.name, this.records.join(','));
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function(model) {
            if (!model.id) {
                model.id = guid();
                model.set(model.idAttribute, model.id);
            }
            this.fakeStorage().setItem(this.name+'-'+model.id, JSON.stringify(model));
            this.records.push(model.id.toString());
            this.save();
            return this.find(model);
        },

        // Update a model by replacing its copy in `this.data`.
        update: function(model) {
            this.fakeStorage().setItem(this.name+'-'+model.id, JSON.stringify(model));
            if (!_.include(this.records, model.id.toString())) {
                this.records.push(model.id.toString());
            }
            this.save();
            return this.find(model);
        },

        // Retrieve a model from `this.data` by id.
        find: function(model) {
            return this.jsonData(this.fakeStorage().getItem(this.name+'-'+model.id));
        },

        // Return the array of all models currently in storage.
        findAll: function() {
            return _(_.range(20)).map(function(){
                return {id: guid(), tweet: FakeTweets.getRandom(), date: new Date()};
            });
        },

        // Delete a model from `this.data`, returning it.
        destroy: function(model) {
            if (model.isNew()) { return false; }
            this.fakeStorage().removeItem(this.name+'-'+model.id);
            this.records = _.reject(this.records, function(id){
                return id === model.id.toString();
            });
            this.save();
            return model;
        },

        fakeStorage: function() {
            return this;
        },

        // fix for "illegal access" error on Android when JSON.parse is passed null
        jsonData: function (data) {
            return data && JSON.parse(data);
        },

        // Clear fakeStorage for specific collection.
        _clear: function() {
            var local = this.fakeStorage(),
            itemRe = new RegExp('^' + this.name + '-');

            // Remove id-tracking item (e.g., 'foo').
            local.removeItem(this.name);

            // Lodash removed _#chain in v1.0.0-rc.1
            // Match all data items (e.g., 'foo-ID') and remove.
            (_.chain || _)(local).keys()
            .filter(function (k) { return itemRe.test(k); })
            .each(function (k) { local.removeItem(k); });

            this.records.length = 0;
        },

        // Size of fakeStorage.
        _storageSize: function() {
            return this.fakeStorage().length;
        }

    });

    // localSync delegate to the model or collection's
    // *fakeStorage* property, which should be an instance of `Store`.
    // window.Store.sync and Backbone.localSync is deprecated, use Backbone.fakeStorage.sync instead
    Backbone.fakeStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options) {
        var store = model.fakeStorage || model.collection.fakeStorage;

        var resp, errorMessage, syncDfd = Backbone.$.Deferred && Backbone.$.Deferred(); //If $ is having Deferred - use it.

        try {

            switch (method) {
            case 'read':
                resp = model.id !== undefined ? store.find(model) : store.findAll();
                break;
            case 'create':
                resp = store.create(model);
                break;
            case 'update':
                resp = store.update(model);
                break;
            case 'delete':
                resp = store.destroy(model);
                break;
            }

        } catch(error) {
            if (error.code === 22 && store._storageSize() === 0) {
                errorMessage = 'Private browsing is unsupported';
            } else {
                errorMessage = error.message;
            }
        }

        if (resp) {
            if (options && options.success) {
                if (Backbone.VERSION === '0.9.10') {
                    options.success(model, resp, options);
                } else {
                    options.success(resp);
                }
            }
            if (syncDfd) {
                syncDfd.resolve(resp);
            }

        } else {
            errorMessage = errorMessage ? errorMessage
            : 'Record Not Found';

            if (options && options.error) {
                if (Backbone.VERSION === '0.9.10') {
                    options.error(model, errorMessage, options);
                } else {
                    options.error(errorMessage);
                }
            }

            if (syncDfd) {
                syncDfd.reject(errorMessage);
            }
        }

        // add compatibility with $.ajax
        // always execute callback for success and error
        if (options && options.complete) {
            options.complete(resp);
        }

        return syncDfd && syncDfd.promise();
    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function(model) {
        if(model.fakeStorage || (model.collection && model.collection.fakeStorage)) {
            return Backbone.localSync;
        }

        return Backbone.ajaxSync;
    };

    // Override 'Backbone.sync' to default to localSync,
    // the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function(method, model, options) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

    return Backbone.fakeStorage;
});