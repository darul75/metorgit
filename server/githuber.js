Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.publish("githubs", function () {
  return Githubs.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});
