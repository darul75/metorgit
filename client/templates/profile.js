// HELPERS
Template.profile.helpers({
	profile: function () {
   //  if (Session.get("summary")) {
   //    return Session.get("summary");
   //  }

  	// Meteor.call("summary", function(err, git){
   //    if (git.length <= 0) return [];
  	// 	Session.set("summary", git[0].repos);      
  	// });

  	// return Session.get("summary");  	
  }  
});

// EVENTS
Template.profile.events({  
  "submit form": function (event) {  	
    event.preventDefault();      
    Meteor.call("updateSummary", {
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      summary: event.target.summary.value
    });
    
    return false;
  }
});

Meteor.subscribe("userData");