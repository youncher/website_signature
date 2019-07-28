const express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(bodyparser.urlencoded( {extended: false} ));
app.use(bodyparser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6776);

//Start of handlers
app.get('/',function(req,res){
    res.render('home');
});

app.get('/aboutme',function(req,res){
    res.render('aboutme');
});

app.get('/gallery',function(req,res){
    res.render('gallery');
});

app.get('/purchase',function(req,res){
    res.render('purchase');
});

app.get('/contact',function(req,res){
    res.render('contact');
});

app.get('/privacy',function(req,res){
    res.render('privacy');
});

// POST route from contact form
app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'server_name',
    port: 587,
    secure: false,
    auth: {
      user: 'username',
      pass: 'password'
    }
  });

	let myEmail = 'my@email.tld';
	
  mailOpts = {
    from: req.body.fname + ' ' + req.body.lname + '  &lt;' + myEmail + ' &gt;',
    to: myEmail,
    subject: 'New message regarding custom signature.',
    text: `Message: ${req.body.message}`
  };
	
  let context = {};
	
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      context.error = true;
      res.render('contact', context);
    }
    else {
      context.success = true;
      res.render('contact', context);
    }
  });
});

//error handling pages
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    //res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'),function(){
    console.log('Express started on port: ' + app.get('port'));
});
