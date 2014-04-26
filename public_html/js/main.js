(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  name:'Postings Collection',
  model: Posting,
  url: function () {
    return '/posts' + ( (this.id) ? '/' + this.id : '' );
  }
});

module.exports = Postings
},{"../models/posting.js":3}],2:[function(require,module,exports){
var Postings = require('./collections/postings.js');
// var Posting = require('./models/posting.js');
var FormView = require('./views/form-view.js');
var PostColView = require('./views/posting-collection-view.js');
var userData = '';

var TopBar = require('./models/topbar.js')
var TopBarView = require('./views/topbar-view.js');

$(function () {   

    var ClimbingRouter = Backbone.Router.extend({});
    var myClimbingRouter = new ClimbingRouter;

    Backbone.history.start();

    var postings = new Postings();
    postings.fetch();

    var topBar = new TopBar()
    var topBarView = new TopBarView({model: topBar});

    var formView = new FormView({collection:postings});
    var appView = new PostColView({collection:postings});
    
    var app = {}
    window.app = app;    
    app.postings = postings;

});
},{"./collections/postings.js":1,"./models/topbar.js":5,"./views/form-view.js":6,"./views/posting-collection-view.js":7,"./views/topbar-view.js":9}],3:[function(require,module,exports){
var Posting = Thorax.Model.extend({
  name:'Posting Model',
  
  urlRoot: '/posts',
  
  initialize: function () {
    this.save();
  },
  
//  defaults: {
//    postingId: 10000,
//    title: 'default post, please ignore',
//    timeStamp: Date.now(),
//    userName: 'Alex Honnold Default',
//    userImg: 'http://lorempixel.com/75/75',
//    climbGym: 'Circuit NE',
//    climbEta: '30',
//    climbDuration: '60',
//    climbDetails: 'Sending V-10\'s like what',
//    replies: []
//  }

});

module.exports = Posting;
},{}],4:[function(require,module,exports){
var Reply = Thorax.Model.extend({
  urlRoot: '/user',
//  defaults: {
//    userName: 'Testing UserName, Please Ignore',
//    userImg: 'http://www.placekitten.com/75/75'
//  }
  defaults: {
    displayName: 'Test User',
    avatar: 'http://lorempixel.com/75/75',
    message: 'hello world'
  }
});

module.exports = Reply; 
},{}],5:[function(require,module,exports){
var TopBar = Thorax.Model.extend({
  url: '/user'
});

module.exports = TopBar; 
},{}],6:[function(require,module,exports){
var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'Form View',
  el: '#sidebar',
  
  events: {
    'click #posting-submit-button': 'newPosting',
    'keypress #climb-details': 'createOnEnter'
  },

  initialize: function () {
    this.render();
  },
  
  postingIdMaker: function () {
    return Math.floor( Math.random() * 1000000000 );
  },
  
  createOnEnter: function () {
    
  },

  newPosting: function () {
    var self = this;   
    
    $.getJSON('/user', function (data) {
      var clmb = {
        gym: $('#climb-gym').val(),
        eta: $('#climb-eta').val(),
        duration: $('#climb-duration').val(),
        details: $('#climb-details').val().trim(),
      };

      var postingId = self.postingIdMaker();
       

      self.collection.create({
        postingId: postingId,
        title: 'posting-' + postingId,
        timeStamp: Date.now(),
        userName: data.displayName,
        userImg: data.avatar,
        climbGym: clmb.gym,
        climbEta: clmb.eta,
        climbDuration: clmb.duration,
        climbDetails: clmb.details,
        replies: [],
        id: postingId,
      });

        $('#climb-gym').val('');
        $('#climb-eta').val('');
        $('#climb-duration').val('');
        $('#climb-details').val('');
        $('.row-offcanvas').toggleClass('active');
    });
  },
});

module.exports = FormView;
},{"../../templates/form.handlebars":10}],7:[function(require,module,exports){
var postingsViewTemplate = require('../../templates/posting.handlebars');
var PostingView = require('./posting-view');
var Posting = require('../models/posting.js');

var PostingCollectionView = Thorax.CollectionView.extend({
  itemTemplate: postingsViewTemplate,
  itemView: PostingView,
  name: 'Postings Collection View',
  el: '#main',
  
  initialize: function () {
    this.render();
  },
  
  
});

module.exports = PostingCollectionView;
},{"../../templates/posting.handlebars":11,"../models/posting.js":3,"./posting-view":8}],8:[function(require,module,exports){
var Reply = require('../models/reply.js');

var PostingView = Thorax.View.extend({
  template: Handlebars.compile('{{collection}}') ,
  name: 'posting-view',
  
  context: function (model, i) {
    return this.model.attributes;
  },
  
  initialize: function () {
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  
  events: {
    'click .posting-reply-button': 'addReply'
  },

  addReply: function (event) {
    
    var self = this;
    
    $.getJSON('/user', function (data) {
    
      var replyArray = _.clone(self.model.get('replies'));

      replyArray.push({
        userName: data.displayName,
        userImg: data.avatar,
        message: $(".posting-reply").val().trim(),
        time: new Date().toDateString(),
        timeStamp: Date.now()
      });

      self.model.save({ replies: replyArray });
      
      console.log(self.model.replies);

      $(".posting-reply").val('');
      
    });
  }
  
  
});

module.exports = PostingView;
},{"../models/reply.js":4}],9:[function(require,module,exports){
var topBarTemplate = require('../../templates/topbar.handlebars');

var TopBarView = Thorax.View.extend({
  template: topBarTemplate,
  el: '#top-bar',
  initialize: function () {
    this.render();
  }
});

module.exports = TopBarView;
},{"../../templates/topbar.handlebars":12}],10:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<aside class=\"panel-default\">\r\n  <select class=\"form-control form-inline\" id=\"climb-gym\" name=\"climb-gym\">\r\n    <option value=\"null\">I'm Climbing at:</option>\r\n    <option value=\"Circuit NE\">The Circuit NE</option>\r\n    <option value=\"Circuit SW\">The Circuit SW</option>\r\n    <option value=\"Portland Rock Gym\">Portland Rock Gym</option>\r\n  </select>\r\n  <select class=\"form-control form-inline\" id=\"climb-eta\" name=\"climb-eta\">\r\n    <option value=\"null\">I'm going in:</option>\r\n    <option value=\"0\">Now!</option>\r\n    <option value=\"15\">15 minutes</option>\r\n    <option value=\"30\">30 minutes</option>\r\n    <option value=\"45\">45 minutes</option>\r\n    <option value=\"60\">1 hour</option>\r\n  </select>\r\n  <select class=\"form-control form-inline\" id=\"climb-duration\" name=\"climb-duration\">\r\n    <option value=\"null\">I'm climbing for:</option>\r\n    <option value=\"30\">30 minutes</option>\r\n    <option value=\"60\">1 hour</option>\r\n    <option value=\"90\">1.5 hours</option>\r\n    <option value=\"120\">2 hours</option>\r\n  </select>\r\n  More Info for fun:\r\n  <textarea class=\"form-control\" rows=\"3\" type=\"text\" id=\"climb-details\" name=\"climb-details\" placeholder=\"Meet me over by the...\"></textarea>\r\n\r\n  <button class=\"btn btn-danger\" id=\"posting-submit-button\">Go Climbing!</button>\r\n</aside>";
  });
},{"handlebars/runtime":19}],11:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <br/>\n        <p>";
  if (helper = helpers.climbDetails) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbDetails); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"panel-body\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.replies), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"list-group\">\n      <div href=\"#\" class=\"list-group-item\">\n        <!--            <div class=\"col-xs-2\"><img class=\"img-responsive\"  src=\""
    + escapeExpression(((stack1 = (depth0 && depth0.userImg)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" /></div>-->\n        <p class=\"list-group-item-text\">\n          <strong>"
    + escapeExpression(((stack1 = (depth0 && depth0.userName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> - "
    + escapeExpression(((stack1 = (depth0 && depth0.message)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n          <br>\n          <small>"
    + escapeExpression(((stack1 = (depth0 && depth0.time)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</small>\n        </p>\n      </div>\n    </div>\n    ";
  return buffer;
  }

  buffer += escapeExpression((helper = helpers.view || (depth0 && depth0.view),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.collection), options) : helperMissing.call(depth0, "view", (depth0 && depth0.collection), options)))
    + "\n<div class=\"panel panel-default panel-posting\">\n  <div class=\"panel-heading\">\n    <div class=\"row\">\n      <div class=\"col-xs-2\">\n        <img src=\"";
  if (helper = helpers.userImg) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.userImg); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n      </div>\n      <div class=\"col-xs-10 panel-emphasis\">\n        <strong>";
  if (helper = helpers.userName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.userName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong>\n        <em>@ ";
  if (helper = helpers.climbGym) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbGym); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " in ";
  if (helper = helpers.climbEta) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbEta); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " for ";
  if (helper = helpers.climbDuration) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.climbDuration); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " minutes</em>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.climbDetails), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n    </div>\n  </div>\n  \n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.replies), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  \n  <div class=\"panel-footer\">\n    <textarea class=\"form-control posting-reply\" rows=\"1\" type=\"text\" name=\"posting-reply\" placeholder=\"Maybe we should meet up...\"></textarea>\n    <button class=\"btn btn-default posting-reply-button\" type=\"submit\">Reply</button>\n  </div>\n</div>";
  return buffer;
  });
},{"handlebars/runtime":19}],12:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"navbar navbar-fixed-top navbar-inverse topbar\" role=\"navigation\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">Climbing Buddy PDX</a>\n          \n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n        <i class=\"fa fa-bars\"></i>\n      </button>\n      \n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"offcanvas\">\n        <i class=\"fa fa-plus\"></i>\n      </button>\n    \n    </div>\n    \n    \n    \n    <div class=\"collapse navbar-collapse no-list\">\n      <li class=\"navbar-text navbar-right dropdown\">\n        Hi, ";
  if (helper = helpers.displayName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.displayName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "!\n        <img class=\"hidden-xs\" src=\"";
  if (helper = helpers.avatar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avatar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n        <a class=\"hidden-xs dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">\n          <i class=\"fa fa-caret-down fa-lg\"></i>\n        </a>\n        <a class=\"visible-xs\" href=\"/logout\">Logout</a>\n      <ul class=\"dropdown-menu\">        \n          <li><a href=\"/logout\">Logout</a></li>                  \n      </ul>\n\n      </li>\n    \n<!--\n    <li class=\"dropdown\">\n      <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Dropdown <b class=\"caret\"></b></a>\n      <ul class=\"dropdown-menu\">\n        <li><a href=\"#\">Action</a></li>\n      </ul>\n    </li>\n-->\n    </div>\n  \n    \n    <div class=\"collapse\">\n      \n    </div>\n    \n  </div>\n</div>\n";
  return buffer;
  });
},{"handlebars/runtime":19}],13:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":14,"./handlebars/exception":15,"./handlebars/runtime":16,"./handlebars/safe-string":17,"./handlebars/utils":18}],14:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":15,"./utils":18}],15:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],16:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":14,"./exception":15,"./utils":18}],17:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],18:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":17}],19:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":13}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL2NvbGxlY3Rpb25zL3Bvc3RpbmdzLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvZmFrZV85MzZiMWQzYy5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL21vZGVscy9wb3N0aW5nLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvbW9kZWxzL3JlcGx5LmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvbW9kZWxzL3RvcGJhci5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL3ZpZXdzL2Zvcm0tdmlldy5qcyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL2pzL3ZpZXdzL3Bvc3RpbmctY29sbGVjdGlvbi12aWV3LmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvdmlld3MvcG9zdGluZy12aWV3LmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvanMvdmlld3MvdG9wYmFyLXZpZXcuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L2FwcC90ZW1wbGF0ZXMvZm9ybS5oYW5kbGViYXJzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9hcHAvdGVtcGxhdGVzL3Bvc3RpbmcuaGFuZGxlYmFycyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvYXBwL3RlbXBsYXRlcy90b3BiYXIuaGFuZGxlYmFycyIsIi9Vc2Vycy9jcGVkZC9Ecm9wYm94L2dpdC9jbGltYmluZy1idWRkeS1wZHgvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvZXhjZXB0aW9uLmpzIiwiL1VzZXJzL2NwZWRkL0Ryb3Bib3gvZ2l0L2NsaW1iaW5nLWJ1ZGR5LXBkeC9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvdXRpbHMuanMiLCIvVXNlcnMvY3BlZGQvRHJvcGJveC9naXQvY2xpbWJpbmctYnVkZHktcGR4L25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFBvc3RpbmcgPSByZXF1aXJlKCcuLi9tb2RlbHMvcG9zdGluZy5qcycpO1xuXG52YXIgUG9zdGluZ3MgPSBUaG9yYXguQ29sbGVjdGlvbi5leHRlbmQoe1xuICBuYW1lOidQb3N0aW5ncyBDb2xsZWN0aW9uJyxcbiAgbW9kZWw6IFBvc3RpbmcsXG4gIHVybDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnL3Bvc3RzJyArICggKHRoaXMuaWQpID8gJy8nICsgdGhpcy5pZCA6ICcnICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RpbmdzIiwidmFyIFBvc3RpbmdzID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9ucy9wb3N0aW5ncy5qcycpO1xuLy8gdmFyIFBvc3RpbmcgPSByZXF1aXJlKCcuL21vZGVscy9wb3N0aW5nLmpzJyk7XG52YXIgRm9ybVZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2Zvcm0tdmlldy5qcycpO1xudmFyIFBvc3RDb2xWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9wb3N0aW5nLWNvbGxlY3Rpb24tdmlldy5qcycpO1xudmFyIHVzZXJEYXRhID0gJyc7XG5cbnZhciBUb3BCYXIgPSByZXF1aXJlKCcuL21vZGVscy90b3BiYXIuanMnKVxudmFyIFRvcEJhclZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3RvcGJhci12aWV3LmpzJyk7XG5cbiQoZnVuY3Rpb24gKCkgeyAgIFxuXG4gICAgdmFyIENsaW1iaW5nUm91dGVyID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7fSk7XG4gICAgdmFyIG15Q2xpbWJpbmdSb3V0ZXIgPSBuZXcgQ2xpbWJpbmdSb3V0ZXI7XG5cbiAgICBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG5cbiAgICB2YXIgcG9zdGluZ3MgPSBuZXcgUG9zdGluZ3MoKTtcbiAgICBwb3N0aW5ncy5mZXRjaCgpO1xuXG4gICAgdmFyIHRvcEJhciA9IG5ldyBUb3BCYXIoKVxuICAgIHZhciB0b3BCYXJWaWV3ID0gbmV3IFRvcEJhclZpZXcoe21vZGVsOiB0b3BCYXJ9KTtcblxuICAgIHZhciBmb3JtVmlldyA9IG5ldyBGb3JtVmlldyh7Y29sbGVjdGlvbjpwb3N0aW5nc30pO1xuICAgIHZhciBhcHBWaWV3ID0gbmV3IFBvc3RDb2xWaWV3KHtjb2xsZWN0aW9uOnBvc3RpbmdzfSk7XG4gICAgXG4gICAgdmFyIGFwcCA9IHt9XG4gICAgd2luZG93LmFwcCA9IGFwcDsgICAgXG4gICAgYXBwLnBvc3RpbmdzID0gcG9zdGluZ3M7XG5cbn0pOyIsInZhciBQb3N0aW5nID0gVGhvcmF4Lk1vZGVsLmV4dGVuZCh7XG4gIG5hbWU6J1Bvc3RpbmcgTW9kZWwnLFxuICBcbiAgdXJsUm9vdDogJy9wb3N0cycsXG4gIFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zYXZlKCk7XG4gIH0sXG4gIFxuLy8gIGRlZmF1bHRzOiB7XG4vLyAgICBwb3N0aW5nSWQ6IDEwMDAwLFxuLy8gICAgdGl0bGU6ICdkZWZhdWx0IHBvc3QsIHBsZWFzZSBpZ25vcmUnLFxuLy8gICAgdGltZVN0YW1wOiBEYXRlLm5vdygpLFxuLy8gICAgdXNlck5hbWU6ICdBbGV4IEhvbm5vbGQgRGVmYXVsdCcsXG4vLyAgICB1c2VySW1nOiAnaHR0cDovL2xvcmVtcGl4ZWwuY29tLzc1Lzc1Jyxcbi8vICAgIGNsaW1iR3ltOiAnQ2lyY3VpdCBORScsXG4vLyAgICBjbGltYkV0YTogJzMwJyxcbi8vICAgIGNsaW1iRHVyYXRpb246ICc2MCcsXG4vLyAgICBjbGltYkRldGFpbHM6ICdTZW5kaW5nIFYtMTBcXCdzIGxpa2Ugd2hhdCcsXG4vLyAgICByZXBsaWVzOiBbXVxuLy8gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdGluZzsiLCJ2YXIgUmVwbHkgPSBUaG9yYXguTW9kZWwuZXh0ZW5kKHtcbiAgdXJsUm9vdDogJy91c2VyJyxcbi8vICBkZWZhdWx0czoge1xuLy8gICAgdXNlck5hbWU6ICdUZXN0aW5nIFVzZXJOYW1lLCBQbGVhc2UgSWdub3JlJyxcbi8vICAgIHVzZXJJbWc6ICdodHRwOi8vd3d3LnBsYWNla2l0dGVuLmNvbS83NS83NSdcbi8vICB9XG4gIGRlZmF1bHRzOiB7XG4gICAgZGlzcGxheU5hbWU6ICdUZXN0IFVzZXInLFxuICAgIGF2YXRhcjogJ2h0dHA6Ly9sb3JlbXBpeGVsLmNvbS83NS83NScsXG4gICAgbWVzc2FnZTogJ2hlbGxvIHdvcmxkJ1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXBseTsgIiwidmFyIFRvcEJhciA9IFRob3JheC5Nb2RlbC5leHRlbmQoe1xuICB1cmw6ICcvdXNlcidcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcEJhcjsgIiwidmFyIGZvcm1WaWV3VGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZXMvZm9ybS5oYW5kbGViYXJzJyk7XG5cbnZhciBGb3JtVmlldyA9IFRob3JheC5WaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiBmb3JtVmlld1RlbXBsYXRlLFxuICBuYW1lOiAnRm9ybSBWaWV3JyxcbiAgZWw6ICcjc2lkZWJhcicsXG4gIFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgI3Bvc3Rpbmctc3VibWl0LWJ1dHRvbic6ICduZXdQb3N0aW5nJyxcbiAgICAna2V5cHJlc3MgI2NsaW1iLWRldGFpbHMnOiAnY3JlYXRlT25FbnRlcidcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfSxcbiAgXG4gIHBvc3RpbmdJZE1ha2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDAwICk7XG4gIH0sXG4gIFxuICBjcmVhdGVPbkVudGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgXG4gIH0sXG5cbiAgbmV3UG9zdGluZzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpczsgICBcbiAgICBcbiAgICAkLmdldEpTT04oJy91c2VyJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBjbG1iID0ge1xuICAgICAgICBneW06ICQoJyNjbGltYi1neW0nKS52YWwoKSxcbiAgICAgICAgZXRhOiAkKCcjY2xpbWItZXRhJykudmFsKCksXG4gICAgICAgIGR1cmF0aW9uOiAkKCcjY2xpbWItZHVyYXRpb24nKS52YWwoKSxcbiAgICAgICAgZGV0YWlsczogJCgnI2NsaW1iLWRldGFpbHMnKS52YWwoKS50cmltKCksXG4gICAgICB9O1xuXG4gICAgICB2YXIgcG9zdGluZ0lkID0gc2VsZi5wb3N0aW5nSWRNYWtlcigpO1xuICAgICAgIFxuXG4gICAgICBzZWxmLmNvbGxlY3Rpb24uY3JlYXRlKHtcbiAgICAgICAgcG9zdGluZ0lkOiBwb3N0aW5nSWQsXG4gICAgICAgIHRpdGxlOiAncG9zdGluZy0nICsgcG9zdGluZ0lkLFxuICAgICAgICB0aW1lU3RhbXA6IERhdGUubm93KCksXG4gICAgICAgIHVzZXJOYW1lOiBkYXRhLmRpc3BsYXlOYW1lLFxuICAgICAgICB1c2VySW1nOiBkYXRhLmF2YXRhcixcbiAgICAgICAgY2xpbWJHeW06IGNsbWIuZ3ltLFxuICAgICAgICBjbGltYkV0YTogY2xtYi5ldGEsXG4gICAgICAgIGNsaW1iRHVyYXRpb246IGNsbWIuZHVyYXRpb24sXG4gICAgICAgIGNsaW1iRGV0YWlsczogY2xtYi5kZXRhaWxzLFxuICAgICAgICByZXBsaWVzOiBbXSxcbiAgICAgICAgaWQ6IHBvc3RpbmdJZCxcbiAgICAgIH0pO1xuXG4gICAgICAgICQoJyNjbGltYi1neW0nKS52YWwoJycpO1xuICAgICAgICAkKCcjY2xpbWItZXRhJykudmFsKCcnKTtcbiAgICAgICAgJCgnI2NsaW1iLWR1cmF0aW9uJykudmFsKCcnKTtcbiAgICAgICAgJCgnI2NsaW1iLWRldGFpbHMnKS52YWwoJycpO1xuICAgICAgICAkKCcucm93LW9mZmNhbnZhcycpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm1WaWV3OyIsInZhciBwb3N0aW5nc1ZpZXdUZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uL3RlbXBsYXRlcy9wb3N0aW5nLmhhbmRsZWJhcnMnKTtcbnZhciBQb3N0aW5nVmlldyA9IHJlcXVpcmUoJy4vcG9zdGluZy12aWV3Jyk7XG52YXIgUG9zdGluZyA9IHJlcXVpcmUoJy4uL21vZGVscy9wb3N0aW5nLmpzJyk7XG5cbnZhciBQb3N0aW5nQ29sbGVjdGlvblZpZXcgPSBUaG9yYXguQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtcbiAgaXRlbVRlbXBsYXRlOiBwb3N0aW5nc1ZpZXdUZW1wbGF0ZSxcbiAgaXRlbVZpZXc6IFBvc3RpbmdWaWV3LFxuICBuYW1lOiAnUG9zdGluZ3MgQ29sbGVjdGlvbiBWaWV3JyxcbiAgZWw6ICcjbWFpbicsXG4gIFxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfSxcbiAgXG4gIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdGluZ0NvbGxlY3Rpb25WaWV3OyIsInZhciBSZXBseSA9IHJlcXVpcmUoJy4uL21vZGVscy9yZXBseS5qcycpO1xuXG52YXIgUG9zdGluZ1ZpZXcgPSBUaG9yYXguVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogSGFuZGxlYmFycy5jb21waWxlKCd7e2NvbGxlY3Rpb259fScpICxcbiAgbmFtZTogJ3Bvc3RpbmctdmlldycsXG4gIFxuICBjb250ZXh0OiBmdW5jdGlvbiAobW9kZWwsIGkpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5hdHRyaWJ1dGVzO1xuICB9LFxuICBcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlJywgdGhpcy5yZW5kZXIpO1xuICB9LFxuICBcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIC5wb3N0aW5nLXJlcGx5LWJ1dHRvbic6ICdhZGRSZXBseSdcbiAgfSxcblxuICBhZGRSZXBseTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgICQuZ2V0SlNPTignL3VzZXInLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIFxuICAgICAgdmFyIHJlcGx5QXJyYXkgPSBfLmNsb25lKHNlbGYubW9kZWwuZ2V0KCdyZXBsaWVzJykpO1xuXG4gICAgICByZXBseUFycmF5LnB1c2goe1xuICAgICAgICB1c2VyTmFtZTogZGF0YS5kaXNwbGF5TmFtZSxcbiAgICAgICAgdXNlckltZzogZGF0YS5hdmF0YXIsXG4gICAgICAgIG1lc3NhZ2U6ICQoXCIucG9zdGluZy1yZXBseVwiKS52YWwoKS50cmltKCksXG4gICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgIHRpbWVTdGFtcDogRGF0ZS5ub3coKVxuICAgICAgfSk7XG5cbiAgICAgIHNlbGYubW9kZWwuc2F2ZSh7IHJlcGxpZXM6IHJlcGx5QXJyYXkgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKHNlbGYubW9kZWwucmVwbGllcyk7XG5cbiAgICAgICQoXCIucG9zdGluZy1yZXBseVwiKS52YWwoJycpO1xuICAgICAgXG4gICAgfSk7XG4gIH1cbiAgXG4gIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdGluZ1ZpZXc7IiwidmFyIHRvcEJhclRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vdGVtcGxhdGVzL3RvcGJhci5oYW5kbGViYXJzJyk7XG5cbnZhciBUb3BCYXJWaWV3ID0gVGhvcmF4LlZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IHRvcEJhclRlbXBsYXRlLFxuICBlbDogJyN0b3AtYmFyJyxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcEJhclZpZXc7IiwidmFyIHRlbXBsYXRlciA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIikuZGVmYXVsdC50ZW1wbGF0ZTttb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlcihmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8YXNpZGUgY2xhc3M9XFxcInBhbmVsLWRlZmF1bHRcXFwiPlxcclxcbiAgPHNlbGVjdCBjbGFzcz1cXFwiZm9ybS1jb250cm9sIGZvcm0taW5saW5lXFxcIiBpZD1cXFwiY2xpbWItZ3ltXFxcIiBuYW1lPVxcXCJjbGltYi1neW1cXFwiPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCJudWxsXFxcIj5JJ20gQ2xpbWJpbmcgYXQ6PC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIkNpcmN1aXQgTkVcXFwiPlRoZSBDaXJjdWl0IE5FPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIkNpcmN1aXQgU1dcXFwiPlRoZSBDaXJjdWl0IFNXPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIlBvcnRsYW5kIFJvY2sgR3ltXFxcIj5Qb3J0bGFuZCBSb2NrIEd5bTwvb3B0aW9uPlxcclxcbiAgPC9zZWxlY3Q+XFxyXFxuICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2wgZm9ybS1pbmxpbmVcXFwiIGlkPVxcXCJjbGltYi1ldGFcXFwiIG5hbWU9XFxcImNsaW1iLWV0YVxcXCI+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIm51bGxcXFwiPkknbSBnb2luZyBpbjo8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiMFxcXCI+Tm93ITwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCIxNVxcXCI+MTUgbWludXRlczwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCIzMFxcXCI+MzAgbWludXRlczwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCI0NVxcXCI+NDUgbWludXRlczwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCI2MFxcXCI+MSBob3VyPC9vcHRpb24+XFxyXFxuICA8L3NlbGVjdD5cXHJcXG4gIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbCBmb3JtLWlubGluZVxcXCIgaWQ9XFxcImNsaW1iLWR1cmF0aW9uXFxcIiBuYW1lPVxcXCJjbGltYi1kdXJhdGlvblxcXCI+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIm51bGxcXFwiPkknbSBjbGltYmluZyBmb3I6PC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjMwXFxcIj4zMCBtaW51dGVzPC9vcHRpb24+XFxyXFxuICAgIDxvcHRpb24gdmFsdWU9XFxcIjYwXFxcIj4xIGhvdXI8L29wdGlvbj5cXHJcXG4gICAgPG9wdGlvbiB2YWx1ZT1cXFwiOTBcXFwiPjEuNSBob3Vyczwvb3B0aW9uPlxcclxcbiAgICA8b3B0aW9uIHZhbHVlPVxcXCIxMjBcXFwiPjIgaG91cnM8L29wdGlvbj5cXHJcXG4gIDwvc2VsZWN0PlxcclxcbiAgTW9yZSBJbmZvIGZvciBmdW46XFxyXFxuICA8dGV4dGFyZWEgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgcm93cz1cXFwiM1xcXCIgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcImNsaW1iLWRldGFpbHNcXFwiIG5hbWU9XFxcImNsaW1iLWRldGFpbHNcXFwiIHBsYWNlaG9sZGVyPVxcXCJNZWV0IG1lIG92ZXIgYnkgdGhlLi4uXFxcIj48L3RleHRhcmVhPlxcclxcblxcclxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1kYW5nZXJcXFwiIGlkPVxcXCJwb3N0aW5nLXN1Ym1pdC1idXR0b25cXFwiPkdvIENsaW1iaW5nITwvYnV0dG9uPlxcclxcbjwvYXNpZGU+XCI7XG4gIH0pOyIsInZhciB0ZW1wbGF0ZXIgPSByZXF1aXJlKFwiaGFuZGxlYmFycy9ydW50aW1lXCIpLmRlZmF1bHQudGVtcGxhdGU7bW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZXIoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgb3B0aW9ucywgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcywgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3Npbmc7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICAgICAgPGJyLz5cXG4gICAgICAgIDxwPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jbGltYkRldGFpbHMpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuY2xpbWJEZXRhaWxzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvcD5cXG4gICAgICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbmZ1bmN0aW9uIHByb2dyYW0zKGRlcHRoMCxkYXRhKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxO1xuICBidWZmZXIgKz0gXCJcXG4gIDxkaXYgY2xhc3M9XFxcInBhbmVsLWJvZHlcXFwiPlxcbiAgICBcIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5yZXBsaWVzKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDQsIHByb2dyYW00LCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbiAgPC9kaXY+XFxuICBcIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuZnVuY3Rpb24gcHJvZ3JhbTQoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazE7XG4gIGJ1ZmZlciArPSBcIlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWdyb3VwXFxcIj5cXG4gICAgICA8ZGl2IGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJsaXN0LWdyb3VwLWl0ZW1cXFwiPlxcbiAgICAgICAgPCEtLSAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0yXFxcIj48aW1nIGNsYXNzPVxcXCJpbWctcmVzcG9uc2l2ZVxcXCIgIHNyYz1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoZGVwdGgwICYmIGRlcHRoMC51c2VySW1nKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiIC8+PC9kaXY+LS0+XFxuICAgICAgICA8cCBjbGFzcz1cXFwibGlzdC1ncm91cC1pdGVtLXRleHRcXFwiPlxcbiAgICAgICAgICA8c3Ryb25nPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMCAmJiBkZXB0aDAudXNlck5hbWUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIjwvc3Ryb25nPiAtIFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMCAmJiBkZXB0aDAubWVzc2FnZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxuICAgICAgICAgIDxicj5cXG4gICAgICAgICAgPHNtYWxsPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKGRlcHRoMCAmJiBkZXB0aDAudGltZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiPC9zbWFsbD5cXG4gICAgICAgIDwvcD5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIFwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oKGhlbHBlciA9IGhlbHBlcnMudmlldyB8fCAoZGVwdGgwICYmIGRlcHRoMC52aWV3KSxvcHRpb25zPXtoYXNoOnt9LGRhdGE6ZGF0YX0saGVscGVyID8gaGVscGVyLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5jb2xsZWN0aW9uKSwgb3B0aW9ucykgOiBoZWxwZXJNaXNzaW5nLmNhbGwoZGVwdGgwLCBcInZpZXdcIiwgKGRlcHRoMCAmJiBkZXB0aDAuY29sbGVjdGlvbiksIG9wdGlvbnMpKSlcbiAgICArIFwiXFxuPGRpdiBjbGFzcz1cXFwicGFuZWwgcGFuZWwtZGVmYXVsdCBwYW5lbC1wb3N0aW5nXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcInBhbmVsLWhlYWRpbmdcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC14cy0yXFxcIj5cXG4gICAgICAgIDxpbWcgc3JjPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudXNlckltZykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC51c2VySW1nKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIlxcXCIgLz5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wteHMtMTAgcGFuZWwtZW1waGFzaXNcXFwiPlxcbiAgICAgICAgPHN0cm9uZz5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMudXNlck5hbWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudXNlck5hbWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9zdHJvbmc+XFxuICAgICAgICA8ZW0+QCBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuY2xpbWJHeW0pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuY2xpbWJHeW0pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiIGluIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jbGltYkV0YSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5jbGltYkV0YSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCIgZm9yIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5jbGltYkR1cmF0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmNsaW1iRHVyYXRpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiIG1pbnV0ZXM8L2VtPlxcbiAgICAgICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmNsaW1iRGV0YWlscyksIHtoYXNoOnt9LGludmVyc2U6c2VsZi5ub29wLGZuOnNlbGYucHJvZ3JhbSgxLCBwcm9ncmFtMSwgZGF0YSksZGF0YTpkYXRhfSk7XG4gIGlmKHN0YWNrMSB8fCBzdGFjazEgPT09IDApIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICA8L2Rpdj5cXG4gIFxcbiAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLnJlcGxpZXMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oMywgcHJvZ3JhbTMsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuICBcXG4gIDxkaXYgY2xhc3M9XFxcInBhbmVsLWZvb3RlclxcXCI+XFxuICAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiZm9ybS1jb250cm9sIHBvc3RpbmctcmVwbHlcXFwiIHJvd3M9XFxcIjFcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcInBvc3RpbmctcmVwbHlcXFwiIHBsYWNlaG9sZGVyPVxcXCJNYXliZSB3ZSBzaG91bGQgbWVldCB1cC4uLlxcXCI+PC90ZXh0YXJlYT5cXG4gICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0IHBvc3RpbmctcmVwbHktYnV0dG9uXFxcIiB0eXBlPVxcXCJzdWJtaXRcXFwiPlJlcGx5PC9idXR0b24+XFxuICA8L2Rpdj5cXG48L2Rpdj5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7IiwidmFyIHRlbXBsYXRlciA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIikuZGVmYXVsdC50ZW1wbGF0ZTttb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlcihmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcblxuXG4gIGJ1ZmZlciArPSBcIjxkaXYgY2xhc3M9XFxcIm5hdmJhciBuYXZiYXItZml4ZWQtdG9wIG5hdmJhci1pbnZlcnNlIHRvcGJhclxcXCIgcm9sZT1cXFwibmF2aWdhdGlvblxcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJuYXZiYXItaGVhZGVyXFxcIj5cXG4gICAgICA8YSBjbGFzcz1cXFwibmF2YmFyLWJyYW5kXFxcIiBocmVmPVxcXCIjXFxcIj5DbGltYmluZyBCdWRkeSBQRFg8L2E+XFxuICAgICAgICAgIFxcbiAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwibmF2YmFyLXRvZ2dsZVxcXCIgZGF0YS10b2dnbGU9XFxcImNvbGxhcHNlXFxcIiBkYXRhLXRhcmdldD1cXFwiLm5hdmJhci1jb2xsYXBzZVxcXCI+XFxuICAgICAgICA8aSBjbGFzcz1cXFwiZmEgZmEtYmFyc1xcXCI+PC9pPlxcbiAgICAgIDwvYnV0dG9uPlxcbiAgICAgIFxcbiAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwibmF2YmFyLXRvZ2dsZVxcXCIgZGF0YS10b2dnbGU9XFxcIm9mZmNhbnZhc1xcXCI+XFxuICAgICAgICA8aSBjbGFzcz1cXFwiZmEgZmEtcGx1c1xcXCI+PC9pPlxcbiAgICAgIDwvYnV0dG9uPlxcbiAgICBcXG4gICAgPC9kaXY+XFxuICAgIFxcbiAgICBcXG4gICAgXFxuICAgIDxkaXYgY2xhc3M9XFxcImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZSBuby1saXN0XFxcIj5cXG4gICAgICA8bGkgY2xhc3M9XFxcIm5hdmJhci10ZXh0IG5hdmJhci1yaWdodCBkcm9wZG93blxcXCI+XFxuICAgICAgICBIaSwgXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRpc3BsYXlOYW1lKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmRpc3BsYXlOYW1lKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIiFcXG4gICAgICAgIDxpbWcgY2xhc3M9XFxcImhpZGRlbi14c1xcXCIgc3JjPVxcXCJcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuYXZhdGFyKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmF2YXRhcik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCJcXFwiPlxcbiAgICAgICAgPGEgY2xhc3M9XFxcImhpZGRlbi14cyBkcm9wZG93bi10b2dnbGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgaHJlZj1cXFwiI1xcXCI+XFxuICAgICAgICAgIDxpIGNsYXNzPVxcXCJmYSBmYS1jYXJldC1kb3duIGZhLWxnXFxcIj48L2k+XFxuICAgICAgICA8L2E+XFxuICAgICAgICA8YSBjbGFzcz1cXFwidmlzaWJsZS14c1xcXCIgaHJlZj1cXFwiL2xvZ291dFxcXCI+TG9nb3V0PC9hPlxcbiAgICAgIDx1bCBjbGFzcz1cXFwiZHJvcGRvd24tbWVudVxcXCI+ICAgICAgICBcXG4gICAgICAgICAgPGxpPjxhIGhyZWY9XFxcIi9sb2dvdXRcXFwiPkxvZ291dDwvYT48L2xpPiAgICAgICAgICAgICAgICAgIFxcbiAgICAgIDwvdWw+XFxuXFxuICAgICAgPC9saT5cXG4gICAgXFxuPCEtLVxcbiAgICA8bGkgY2xhc3M9XFxcImRyb3Bkb3duXFxcIj5cXG4gICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiZHJvcGRvd24tdG9nZ2xlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiPkRyb3Bkb3duIDxiIGNsYXNzPVxcXCJjYXJldFxcXCI+PC9iPjwvYT5cXG4gICAgICA8dWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNcXFwiPkFjdGlvbjwvYT48L2xpPlxcbiAgICAgIDwvdWw+XFxuICAgIDwvbGk+XFxuLS0+XFxuICAgIDwvZGl2PlxcbiAgXFxuICAgIFxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjb2xsYXBzZVxcXCI+XFxuICAgICAgXFxuICAgIDwvZGl2PlxcbiAgICBcXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiJdfQ==
