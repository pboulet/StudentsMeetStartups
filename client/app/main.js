
requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.2.0',
        'knockout.mapping': '../lib/knockout/knockout.mapping-2.4.1',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'jquery.cookie': '../lib/jquery/plugins/jquery.cookie-1.4.1.min',
        'models': './models',
        'session': './lib/session',
        'bootstrapvalidator': '../lib/bootstrapvalidator/js/bootstrapValidator'
    },
    shim: {
        'jquery.cookie': {
            deps: ['jquery']
        },
        'boostrapvalidator': {
            deps: ['jquery'],
            exports: 'jQuery'
       }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'], function (system, app, viewLocator) {

    system.debug(true);

    app.title = 'Students Meet Startups';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {

        // Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        // Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        app.setRoot('viewmodels/shell');
    });
});


