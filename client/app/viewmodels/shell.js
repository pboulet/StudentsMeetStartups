define(function (require) {
    var router = require('plugins/router');

    return {
        router: router,
        activate: function () {
            router.map([
              { route: '', title: 'Home', moduleId: 'viewmodels/home', nav: true },
              { route:'dashboard', title:'Dashboard', moduleId:'viewmodels/dashboard', nav:true },
              { route:'explore', title:'Explore', moduleId:'viewmodels/explore', nav:true },
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});