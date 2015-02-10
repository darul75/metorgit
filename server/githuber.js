GitHub = Meteor.npmRequire('github');
Githubs = new Mongo.Collection('githubs');
Parser = Meteor.npmRequire('markdown-parser');

var github = new GitHub({
    version: "3.0.0", // required
    timeout: 5000     // optional
});

Meteor.startup(function () {
	// GitHub API Auth
	github.authenticate({type: "oauth",key: "6a4ac2fc975203e0c3fb",secret: "c6f4d3a6942d9f5bca405bd6b116e149f38748cf"});
});

Meteor.publish('repos', function () {

  if (! this.userId) {
    throw new Meteor.Error("not-authorized");
  }

  return Githubs.find({_userId: this.userId}, {'repos': 1});

});

Meteor.methods({
  repos: function() {
    return Githubs.find({_userId: Meteor.userId()}, {'repos': 1}).fetch();
  },  
  profile: function(user) {
    return Meteor.users.find({"git.login": user}).fetch();
  },
  repo: function(repoName) {      
    return Githubs.findOne({'_userId': Meteor.userId(), 'repos': {$elemMatch: {full_name: repoName}}}, {fields: {'repos.$': 1}});    
  },
  synchronize: function() {  

  	if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
      
    var user = Meteor.users.findOne(Meteor.userId(), {fields: {services:1}});
    var gitRepos = [];

    // PROFILE

    // REPOS
    var userRepos = [];   
    var userGitProfile = {};
    var languages = {
      git: []
    };
    var apiLimit = 30;
    var apiRepoParams = {user: user.services.github.username, type:'owner', sort:'created', per_page:apiLimit, page:1};    

    var q = QueueAsync(1);
    var tasks=[];
    
    var asyncMainFunction = function(cb) {

      var hasNext = true;

      // Fiber power
      var callGithubRepoAPISync = Meteor.wrapAsync(github.repos.getFromUser);
      var callGithubReadmeAPISync = Meteor.wrapAsync(github.repos.getReadme);
      var callGithubUserAPISync = Meteor.wrapAsync(github.user.getFrom);

      // 1 User info
      var githubUser = callGithubUserAPISync(apiRepoParams);
      userGitProfile = githubUser;

      // 2 Repo info
      while (hasNext) {
        var repos = callGithubRepoAPISync(apiRepoParams);

        // TODO : fix owner api call on github ? here filter no fork wanted
        repos = _.filter(repos, function(repo){ return !repo.fork; });
        if (repos && repos.length > 0) {
          apiRepoParams.page +=1;
        }
        else {
          hasNext = false;
        }

        // do other stuff
        repos.forEach(function(repo) {
          userRepos.push(repo);
          if (!~languages.git.indexOf(repo.language) && repo.language !== null) {        
            languages.git.push(repo.language);
          }

          try {
            var readme = callGithubReadmeAPISync({user:user.services.github.username, repo: repo.name});            
            repo.readme = new Buffer(readme.content, 'base64').toString();
            var parser = new Parser({html_url: repo.html_url});            
            parser.parse(repo.readme, function(err, result) {
              repo.infos = result;
            });
            // result example
          }
          catch(e) {
            // no readme
            repo.readme = 'NO README YET';
          }
          
        });

      }

      // end loop so all is here
      userGitProfile.languages = languages;

      cb(null, {
        userId:user._id, 
        userGitProfile:userGitProfile, 
        userRepos: userRepos
      });
      
    }

    asyncMainFunction(function(err, res) {
      Meteor.call('updateProfile', res);
    });
    
    // console.log(repos);
      
    // //    (apiRepoParams, Meteor.bindEnvironment(function(err, repos) {
        
        

    //     // async queueing function fetch readme
    //     var f = function(repo, param, cb) {
    //       github.repos.getReadme(param, Meteor.bindEnvironment(function(err, readme) {
    //         var buff = new Buffer(readme.content, 'base64');            
    //         repo.readme = buff.toString();
    //         cb(null);
    //       }));
    //     };

    //     // async queueing function fetch profile
    //     var f2 = function(cb) {
    //       github.user.getFrom({user: user.services.github.username}, Meteor.bindEnvironment(function(err, user) {            
    //         userGitProfile = user;
    //         cb(null);
    //       }));
    //     };                

        // push in queue : user profile
        // q.defer(f2);

        // push in queue : user repository
        // repos.forEach(function(repo) {
        //   userRepos.push(repo);
        //   if (!~languages.git.indexOf(repo.language) && repo.language !== null) {        
        //     languages.git.push(repo.language);
        //   }
        //   q.defer(f, repo, {user:user.services.github.username, repo: repo.name});          
        // });

    //     q.awaitAll(function(error, results) {
    //       userGitProfile.languages = languages;           
    //       cb(user._id, userGitProfile, userRepos);
    //       //Meteor.call('updateProfile', user._id, userGitProfile, userRepos);
    //     });

    //   }))); 
    // };

    // };        
  },  
  updateProfile: function(infos) {        
    Meteor.users.update({_id: Meteor.userId()}, {$set: {git: infos.userGitProfile}});
    Githubs.remove({_userId: infos.userId});
    Githubs.insert({_userId: infos.userId, repos: infos.userRepos});    
  },
  updateSummary: function(summary) {        
    Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: summary}});    
  },
  users: function() {
    return Meteor.users.find({}, {fields: {'git': 1}}).fetch();    
  }
});

Meteor.publish('githubs', function () {
  return Githubs.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});

Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {'git': 1}});
});

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'services.github.username': 1, 'git':1, 'profile':1}});
  }
  this.ready();  
});
