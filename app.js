var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');
var cons = require('consolidate');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var session = require('client-sessions');
var flash = require('connect-flash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

//for mongodb connection

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
                    id:ObjectId,
                    firstName:String,
                    lastName:String,
                    username:{type:String,unique: true},
                    password:String,
                    desig :String,
                    phnumber :String,
                    city:String

  
              });

var User = mongoose.model('User' ,UserSchema);

mongoose.connect('mongodb://localhost/newauth');
//bootstrap 
app.use(express.static(path.join(__dirname,'bower_components/bootstrap/dist/css')));
// view engine setup
app.engine('html',cons.swig);
  app.set('view engine','html');
  app.set('views',__dirname+"/public/views");
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser());
app.use(session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        resave: true,
        saveUninitialized: true,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
                 passport.use(new LocalStrategy(

                                      function(username, password, done) {
                                        // return done(null,false,{message:'unable connect'})
                                         User.findOne({ "username": username }, function(err, user) {
                                
                                           
                                              if (err) { return done(err); }
                                           if (!user) {
                                                 return done(null, false,{ message: 'Incorrect username.' } );
                                            }
                                              if (!bcrypt.compareSync(password,user.password)) {
                                                return done(null, false, { message: 'Incorrect password.' });
                                          }
                                            return done(null,user);
                                      
                                    });
                                 }
                ));




    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
      
    });

app.post("/login",passport.authenticate('local'),function(req,res){
            //res.json(req.user);
            //console.log(req.body.username)
            console.log(req.user)

            if (bcrypt.compareSync(req.body.password,req.user.password)) {                                                                                        
                  req.session.user = req.user;
                  res.json(req.user);
                  res.redirect('/profile');
                   
            }
            else{
              res.redirect('/login');
            }                       
  });
 var auth = function(req, res, next){ if (!req.isAuthenticated()) res.send(403); else next(); }; 

app.get('/admin/user',auth,function(req,res){
  //console.log(req.body);
        
               User.find({},function(err,user){
                      res.json(user);
                      //console.log(user)
                   });
                
});
app.post('/register',function(req,res){
              User.findOne({"username" : req.body.username},function(err,user){
                if (user) {
                  console.log('user alredy exist');
                  res.json(null);
                  return;
                }else{
                  var hash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
                  var user = {
                                firstName:req.body.firstName ,
                               lastName:req.body.lastName,
                               username:req.body.username,
                               phnumber:req.body.phnumber,
                               city    :req.body.city,
                               password :hash
                          }
                

                var newUser = new User(user);
                console.log(newUser)
                
                    newUser.save(function(err,user){
                            req.login(user,function(err){
                              if (err) {return next(err)};
                                res.json(user);
                            });
                          })
                    }
             });

});

app.get('/loggedin',function(req,res){
  res.send(req.isAuthenticated() ? req.user:'0');
});

app.get('/profile',function(req,res){
  res.render('profile.html');
});


app.post('/profile',function(req,res){
   
//console.log(req.session.user);
//console.log(req.session)
    //res.render('profile.html')
     if (req.session && req.session.user) {
              console.log('yes its working');
            User.findOne({username:req.session.user.username},function(err,user){
                //console.log(user);
              if (!user) {
                req.session.reset();
                
              }else{
                //res.locals.user = user;
                //console.log(user);
                //res.json(user);
                res.redirect('/profile');
              }
                        
         })

     }
         else{
            res.render('/login');
    }

});

app.get('/logout',function(req,res){
  req.logOut();
  res.send(200);
  //delete req.session.username;
  //res.redirect('/login');

});

app.get('/edit/:id',function(req,res){
  var id = req.params.id;
  //console.log(id);
      User.findOne({_id:id},function(err,doc){
        ///console.log(doc);
        res.json(doc);
      });
});
app.delete('/delete/:id',function(req,res){
  var id = req.params.id;
  //console.dir(id);
      User.remove({_id:id},function(err,doc){
        res.json(doc);
    })
});


app.put('/update/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
User.update(
        {_id:id},{
                    firstName:req.body.firstName ,
                   lastName:req.body.lastName,
                   username:req.body.username,
                   phnumber:req.body.phnumber,
                   city    :req.body.city
                    
                  }
        ,{ upsert: true },
    function(err,doc){res.json(doc);}
);
});
module.exports = app;                                 
