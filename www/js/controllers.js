angular.module('jobHunter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.factory('Jobs', function() {
  return {
    all: function() {
      var jobString = window.localStorage['jobs'];
      if(jobString) {
        return angular.fromJson(jobString);
      }
      return [];
    },
    save: function(jobs) {
      window.localStorage['jobs'] = angular.toJson(jobs);
    },
    newJob: function(companyName) {
      // Add a new project
      return {
        company: companyName,
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveJob']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveJob'] = index;
    }
  }
})

.controller('HuntPageCtrl', function($scope, $timeout, $ionicModal, Jobs, $ionicSideMenuDelegate) {

  // A utility function for creating a new project
  // with the given projectTitle
  var createJob = function(companyName) {
    var newJob = Jobs.newJob(companyName);
    $scope.jobs.push(newJob);
    Jobs.save($scope.jobs);
    $scope.selectJob(newJob, $scope.jobs.length-1);
  }


  // Load or initialize projects
  $scope.jobs = Jobs.all();

  // Grab the last active, or the first job
  $scope.activeJob = $scope.jobs[Jobs.getLastActiveIndex()];

  // Called to create a new job
  $scope.newJob = function() {
    var companyName = prompt('Company Name');
    if(companyName) {
      createJob(companyName);
    }
  };

  // Called to select the given project
  $scope.selectJob = function(job, index) {
    $scope.activeJob = job;
    Jobs.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-job.html', function(modal) {
    $scope.jobModal = modal;
  }, {
    scope: $scope
  });

  $scope.createJob = function(job) {
    console.log("HI");
    console.log($scope.job.company);
    if(!$scope.companyName || !job) {
      return;
    }
    $scope.Jobs.push({
      company: job.company
    });

    $scope.jobModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.jobs);

    job.company = "";
  };

  $scope.newJob = function() {
    $scope.jobModal.show();
  };

  $scope.closeNewJob = function() {
    $scope.jobModal.hide();
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.jobs.length == 0) {
      while(true) {
        var companyName = prompt('Your first applied to:');
        if(companyName) {
          createJob(companyName);
          break;
        }
      }
    }
  }, 1000);

});
