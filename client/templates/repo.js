
// HELPERS
Template.repository.helpers({
	repo: function () {      
  	return Session.get('repo');
  }  
});

// client
Meteor.subscribe("repo");