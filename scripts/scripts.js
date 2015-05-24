"use strict";
angular.module("yapp", ["firebase", "ui.router", "ngAnimate", "ui.bootstrap", "ngResource"])

    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("/dashboard", "/dashboard/job"),
            $urlRouterProvider.otherwise("/dashboard/job"),
            $stateProvider.state("base", {"abstract": !0, url: "", templateUrl: "views/base.html"})
                .state("login", {
                    url: "/login",
                    parent: "base",
                    templateUrl: "views/login.html",
                    controller: "LoginCtrl"
                })
                .state("dashboard", {
                    url: "/dashboard",
                    parent: "base",
                    templateUrl: "views/dashboard.html",
                    controller: "DashboardCtrl"
                })
                .state("profile", {
                    url: "/profile",
                    parent: "dashboard",
                    templateUrl: "views/profile.html",
                    controller: "ProfileCtrl"
                })
                .state("editprofile", {
                    url: "/editprofile",
                    parent: "dashboard",
                    templateUrl: "views/editprofile.html",
                    controller: "ProfileCtrl"
                })

                .state("job", {
                    url: "/job",
                    parent: "dashboard",
                    templateUrl: "views/dashboard/job.html",
                    controller: "JobCtrl"
                })

                .state("newjob", {
                    url: "/newjob",
                    parent: "dashboard",
                    templateUrl: "views/dashboard/postnewjob.html",
                    controller: "newJobCtrl"
                })

                .state("jobDetail", {
                    url: "/jobdetail/:jobId",
                    parent: "dashboard",
                    templateUrl: "views/dashboard/jobDetail.html",
                    controller: "JobDetailCtrl"
                })

                .state("education", {
                    url: "/education",
                    parent: "dashboard",
                    templateUrl: "views/dashboard/education.html"
                })
                .state("business", {
                    url: "/business",
                    parent: "dashboard",
                    templateUrl: "views/dashboard/business.html"
                })
    }])


    .controller("LoginCtrl", ["$scope", "$location", function ($scope, $location) {
        var ref = new Firebase("https://amber-heat-6612.firebaseio.com");
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            };
        });
        $scope.submit = function () {
            console.log('Thsi is loginctrl!')
            return $location.path("/dashboard"), !1
        }
    }])

    .controller("DashboardCtrl", ["$scope", "$state", function ($scope, $state) {
        $scope.$state = $state
    }])


    .controller("ProfileCtrl", ["$scope", "$state", "$firebaseObject", function ($scope, $state, $firebaseObject) {
        $scope.$state = $state;
        var ref = new Firebase("https://amber-heat-6612.firebaseio.com/user");

        // create a synchronized array
        $scope.user = $firebaseObject(ref);

        console.log($scope.user);
        $scope.saveProfile = function () {
            $scope.user.$save({
                text: $scope.user
            });
        }
    }])

    .controller("newJobCtrl", ["$scope", "$firebaseArray", "$location", function ($scope, $firebaseArray, $location) {
        var ref = new Firebase("https://amber-heat-6612.firebaseio.com/jobs");
        $scope.jobtypes = jobtypes;
        $scope.needfix = false;
        $scope.newjob = {};
        $scope.user = null;
        $scope.jobtype = "";
        $scope.jobs = [];
        $scope.$watch('newjob.jobtype', function (v) {
            if ($scope.newjob.jobtype) {
                $scope.jobs = $scope.newjob.jobtype.jobs;
                return console.log($scope.newjob.jobtype.jobs);
            }
        });
        $scope.njobs = $firebaseArray(ref);

        $scope.submit = function () {
            var now = new Date().getTime();
            $scope.newjob.time = now;
            $scope.newjob.jobtype.jobs = {};
            console.dir($scope.newjob)

            $scope.njobs.$add($scope.newjob);
            $scope.needfix = false;
            console.log("job added");
            $scope.newjobs = null;
            return $location.path("/job"), !1
        };

    }])

    .filter('nl2br', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
        };
    })

    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })

    .factory('Entry', function ($resource) {
        return $resource('https://amber-heat-6612.firebaseio.com/jobs/:id.json'); // Note the full endpoint address
    })

    .controller("JobDetailCtrl", ["$scope", "$stateParams", "Entry", "$firebaseArray", function ($scope, $stateParams, Entry, $firebaseArray) {
        console.log($stateParams.jobId);
        $scope.entry = Entry.get({id: $stateParams.jobId});
        console.log($scope.entry);
        console.log($scope.entry.title);
        console.log($scope.entry.jobtype);
        console.log($scope.entry.jobname);
        console.log($scope.entry.salary1);
    }])

    .controller("JobCtrl", ["$scope", "$firebaseArray", function ($scope, $firebaseArray) {
        var ref = new Firebase("https://amber-heat-6612.firebaseio.com/jobs");
        $scope.jobs = $firebaseArray(ref);
    }]);