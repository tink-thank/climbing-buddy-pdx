var Posting = Thorax.Model.extend({
  name:'Posting Model',
  
  urlRoot: '/posts',
  
  initialize: function () {
    this.save();
        
    if(this.get('userName') === user.data.displayName) {
      this.save({userAuth: true});
    }

  }

});

module.exports = Posting;