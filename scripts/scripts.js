"use strict";
angular.module("yapp", ["firebase", "ui.router", "ngAnimate", "ui.bootstrap"])

    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("/dashboard", "/dashboard/job"),
            $urlRouterProvider.otherwise("/login"),
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
        $scope.submit = function () {
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

    .controller("newJobCtrl",["$scope", "$firebaseArray","$location", function ($scope, $firebaseArray, $location) {
        var ref = new Firebase("https://amber-heat-6612.firebaseio.com/jobs");
        $scope.jobtypes = jobtypes;
        $scope.needfix = false;
        $scope.newjob = {};
        $scope.user = null;
        $scope.jobtype = "";
        $scope.jobs = [];
        $scope.$watch('newjob.jobtype', function(v){
            if ($scope.newjob.jobtype) {
                $scope.jobs = $scope.newjob.jobtype.jobs;
                return console.log($scope.newjob.jobtype.jobs);
            }
        });
        $scope.njobs = $firebaseArray(ref);

        $scope.submit = function(){
            var check, t1, t2, now, ref1, ref2;
            check = ['jobname', 'salary2', 'salary1', 'company', 'email', 'jobtype', 'location', 'title'];
            t1 = $scope.newjobform.salary1;
            t2 = $scope.newjobform.salary2;
            t1.$setValidity('salary1', $scope.newjob.salary1 < 67000 ? false : true);
            t2.$setValidity('salary2', isNaN($scope.newjob.salary2) || $scope.newjob.salary2 < $scope.newjob.salary1 ? false : true);

            var now = new Date().getTime();
            $scope.newjob.time = now;
            $scope.newjob.jobtype.jobs = { };
            console.dir($scope.newjob)
            // create a synchronized array

            $scope.njobs.$add( $scope.newjob);
            $scope.needfix = false;
            console.log("job added");
            $scope.newjobs = null ;
            return $location.path("job");
        };


    }])

    .controller("JobCtrl",["$scope", "$firebaseArray", function ($scope, $firebaseArray) {
        var ref = new Firebase("https://amber-heat-6612.firebaseio.com/jobs");

        // create a synchronized array
        $scope.jobs = $firebaseArray(ref);

    }]);