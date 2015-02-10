Template.home.helpers({
  users: function () {
    if (Session.get("users")) {
      return Session.get("users");
    }

    Meteor.call("users", function(err, users) {      
      Session.set("users", users);
    }); 

    return Session.get("users");    
  }
});

Meteor.subscribe('users');