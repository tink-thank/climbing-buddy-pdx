var TopBar = Thorax.Model.extend({
  //urlRoot: '/user',
//  defaults: {
//    userName: 'Testing UserName, Please Ignore',
//    userImg: 'http://www.placekitten.com/75/75'
//  }
  
  userData: {},  
  
  defaults: {
    userName: this.userData.displayName,
    userImg: this.userData.avatar
  }
});

module.exports = TopBar; 