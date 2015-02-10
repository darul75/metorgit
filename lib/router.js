// ROUTERS IRON
Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

Router.route('home', {path: '/'});
Router.route('githuber', {path: '/githuber'});
Router.route('profile', {path: '/profile'});
Router.route('user', {
  path: '/:user',
  template: 'githuberuser',
  data: function () {
    var user = this.params.user;
    Meteor.call('profile', user, function(err, profile){      
      Session.set('profile', profile);                    
    });    
  }
});
Router.route('userRepo', {  
  path: '/:user/:reponame',    
  data: function () {
    var full_name = this.params.user + '/' + this.params.reponame;
    Meteor.call('repo', full_name, function(err, repo){
      var result = (!repo || repo.repos.length == 0) ? {} : repo.repos[0];      
      Session.set('repo', result);                  
    });     
  },
  template: 'repository'
});


 
