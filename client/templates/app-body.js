
Template.appBody.helpers({

});

Template.appBody.events({
  "click .show": function (event) {
    var $nav = $('.appLayout');

    $nav.toggleClass("menu-open");

    return false;
  },
   "click .content": function (event) {
    var $nav = $('.appLayout');

    if(!$(event.target).closest('a').length 
      && !$(event.target).closest('button').length
      && !$(event.target).closest('textarea').length
      && !$(event.target).closest('input').length
      && !$(event.target).closest('.sign-in-text-github').length
      && !$(event.target).closest('#login-buttons-logout').length
      ){
        $nav.toggleClass("menu-open");
        return false;
    }    

    return true;
  }



});