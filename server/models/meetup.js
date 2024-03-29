/**
 * Defines a meetup and its properties, and to what database column they correspond.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

module.exports = function (db, cb) {
    var Meetup = db.define("meetup", {
        startTime:          { type: "date", time: true, mapsTo: "start_time" },
        endTime :           { type: "date", time: true, mapsTo: "end_time" },
        location:           { type: "text" },
        numMaxParticipants: { type: "integer", mapsTo: "max_participants" }
    }, {
        collection: "meetups" /* Real table name */
    });

    return cb();
};


    
