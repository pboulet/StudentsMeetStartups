/**
 * Test suite for the server's REST API
 * 
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var async = require("async"),
    superagent = require("superagent"),
    expect = require("expect.js"),
    mysql = require("mysql"),
    _ = require("lodash"),
    config  = require("./config");

describe("StudentsMeetStartup REST API", function () {
    var startup = {
        companyName: "Acme Inc.",
        emailAddress: "careers@acme.com",
        websiteUrl: "http://www.acme.com",
        description: "A division of Alpha Ltd.",
        postalAddress: "75 Laurier Avenue East, Ottawa ON  K1N 6N5, Canada",
        username: "acmeadmin",
        password: "secret"
    };

    var startupCredentials = {
        username: "acmeadmin",
        password: "secret"
    };

    var updatedStartup = {
        companyName: "Acme Networks Inc.",
        emailAddress: "careers@acme.net",
        websiteUrl: "http://www.acme.net",
        description: "A division of Beta Solutions Ltd."
    };

    var student = {
        name: "Timothy Lethbridge",
        emailAddress: "tcl@site.uottawa.ca",
        phoneNumber: "6131234567",
        selfDescription: "I love Apple!",
        username: "tim",
        password: "th1si5a5tr0n9password;;"
    };

    var studentCredentials = {
        username: "tim",
        password: "th1si5a5tr0n9password;;"
    };

    var updatedStudent = {
        emailAddress: "tcl@eecs.uottawa.ca",
        phoneNumber: "6132222222",
        selfDescription: "I love Microsoft!"
    };
        
    var meetup = {
        startTime: "2014-10-22 09:52:00",
        endTime: "2014-10-22 09:55:00",
        numMaxParticipants: 6,
        location: "Gloucester"
    };

    before(function(done){
        var conn = mysql.createConnection(config.development.dataSourceName);

        conn.connect(function (error) {
            if (error)
                done(error);
            else
            {
                async.series([
                    conn.query.bind(conn, "TRUNCATE TABLE `students`"),
                    conn.query.bind(conn, "TRUNCATE TABLE `startups`"),
                    conn.query.bind(conn, "TRUNCATE TABLE `meetups`"),
                    conn.query.bind(conn, "TRUNCATE TABLE `useraccounts`"),
                    conn.query.bind(conn, "TRUNCATE TABLE `startup_accounts`"),
                    conn.query.bind(conn, "TRUNCATE TABLE `meetup_participants`"),
                ], done);
            }
        });
    });

    it("can create a startup", function (done) {
        http.post("/startup", { "startup": startup }).test(function (response) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.have.key("id");
            expect(response.startup.id).to.be.ok();
            startup.id = response.startup.id;

            delete startup.username;
            delete startup.password;

            expect(response.startup).to.eql(startup);

            done();
        });
    });
    
    it("can update a startup", function (done) {
        http.put("/startup/" + startup.id, {"startup": _.extend(startup, updatedStartup)}).test(function (response) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.eql(_.extend(startup, updatedStartup));

            done();
        });
    });

    it("can find a statup", function (done) {
        http.get("/startup/" + startup.id).test(function (response) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.eql(_.extend(startup, updatedStartup));
            done();
        });
    });
    
    it("can login as a startup", function (done) {
        http.post("/login", startupCredentials).test(function (response, headers) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.eql(_.extend(startup, updatedStartup));
            expect(headers).to.have.key("set-cookie");
            expect(headers["set-cookie"][0]).to.match(/^connect\.sid/);

            done();
        });
    });

    it("can create a student", function (done) {
        http.post("/student", { "student": student }).test(function (response) {
            expect(response).to.have.property("student");

            expect(response.student).to.have.key("id");
            expect(response.student.id).to.be.ok();
            student.id = response.student.id;

            delete student.username;
            delete student.password;
            
            expect(response.student).to.eql(student);

            done();
        });
    });
    
    it("can update a student", function (done) {
        http.put("/student/" + student.id, {"student": updatedStudent}).test(function (response) {
            expect(response).to.have.property("student");
            expect(response.student).to.eql(_.extend(student, updatedStudent));

            done();
        });
    });

    it("can find a student", function (done) {
        http.get("/student/" + student.id).test(function (response) {
            expect(response).to.have.property("student");
            expect(response.student).to.eql(_.extend(student, updatedStudent));
            done();
        });
    });
    
    it("can login as a student", function (done) {
        http.post("/login", studentCredentials).test(function (response, headers) {
            expect(response).to.have.property("student");
            expect(response.student).to.eql(_.extend(student, updatedStudent));
            expect(headers).to.have.key("set-cookie");
            expect(headers["set-cookie"][0]).to.match(/^connect\.sid/);

            done();
        });
    });
    
    it("can create a meetup", function (done) {
        meetup.startupId = startup.id;

        http.post("/meetup", { "meetup": meetup }).test(function (response) {
            expect(response).to.have.property("meetup");
            expect(response.meetup).to.have.key("id");
            expect(response.meetup.id).to.be.ok();
            meetup.id = response.meetup.id;

            expect(response.meetup).to.eql(meetup);

            done();
        });
    });

    it("can add a meetup participant", function (done) {
        http.post("/meetup/participant", { "meetupId": meetup.id, "studentId": student.id })
            .test(function (response) { done(); });
    });

    var http = {};

    http.get = function (uri) {
        return new RouteTest("get", uri, null);
    };

    http.post = function (uri, data) {
        return new RouteTest("post", uri, data);
    };
    
    http.put = function (uri, data) {
        return new RouteTest("put", uri, data);
    };

    function RouteTest(httpVerb, uri, data)
    {
        var url = "http://localhost:3000" + uri;
        var method = superagent[httpVerb];

        this.test = function (testFunction) {
            method(url)
            .send(data)
            .end(function (error, response) {
                expect(response.status).to.be(200);
                expect(error).to.eql(null);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.be(true);
                testFunction(response.body, response.headers);
            });
        };

        return this;
    }
});

