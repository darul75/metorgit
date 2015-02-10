
Meteor.subscribe('repos', function(err, t) {
	console.log(t);
});

// HELPERS
Template.githuber.helpers({
	repos: function () {
    if (Session.get("filterRepos")) {
      return Session.get("filterRepos");
    }

  	Meteor.call("repos", function(err, git){
      if (git.length <= 0) return [];
  		Session.set("repos", git[0].repos);
      Session.set("allRepos", git[0].repos);
  	}); 

  	return Session.get("repos");  	
  }  
});

// EVENTS
Template.githuber.events({  
  "click #synchronize": function (event) {
  	Meteor.call("synchronize");    
    return false;
  },
  "click #profile": function(event) {   
    Router.go('/profile');  
  },
  "click .btn-language": function (event) {
    var language = event.target.text;
    var allRepos = Session.get("allRepos");
    var filterRepos = _.filter(allRepos, function(repo){ return repo.language === language; });
    Session.set("filterRepos", filterRepos);

    return false;
  }
});

Meteor.subscribe("userData");


