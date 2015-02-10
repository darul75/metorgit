// simple-todos.js


// Githubs.allow({
//   insert: function(userId) {
//     var user = Meteor.github.findOne(userId);
//     return user && user.admin;
//   }
// });


// // At the bottom of simple-todos.js, outside of the client-only block
// Meteor.methods({
  
//   add: function (text) {
//     // Make sure the user is logged in before inserting a task
//     if (! Meteor.userId()) {
//       throw new Meteor.Error("not-authorized");
//     }

//     Githubs.insert({
//       text: text,
//       createdAt: new Date(),
//       owner: Meteor.userId(),
//       username: Meteor.user().username
//     });
//   },
//   delete: function (githubId) {
//     // Inside the deleteTask method
//     var github = Githubs.findOne(githubId);
//     if (github.private && github.owner !== Meteor.userId()) {
//       // If the github is private, make sure only the owner can delete it
//       throw new Meteor.Error("not-authorized");
//     }
//     Githubs.remove(githubId);
//   },
//   setChecked: function (githubId, setChecked) {
//     // Inside the setChecked method
//     var github = Githubs.findOne(githubId);
//     if (github.private && github.owner !== Meteor.userId()) {
//       // If the github is private, make sure only the owner can check it off
//       throw new Meteor.Error("not-authorized");
//     }
//     Githubs.update(githubId, { $set: { checked: setChecked} });
//   },
//   setPrivate: function (githubId, setToPrivate) {
//     var github = Githubs.findOne(githubId);

//     // Make sure only the github owner can make a task private
//     if (github.owner !== Meteor.userId()) {
//       throw new Meteor.Error("not-authorized");
//     }

//     Githubs.update(githubId, { $set: { private: setToPrivate } });
//   }
// });
