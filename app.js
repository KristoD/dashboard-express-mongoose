var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dog_dashboard');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var dogSchema = new mongoose.Schema({
    breed: {type: String, required: true, minlength: 2},
    image: String,
    created: {type: Date, default: Date.now}
})

var Dog = mongoose.model('Dog', dogSchema);

app.get('/', function(req, res) {
    Dog.find({}, function(err, dogs) {
        if(err) {
            console.log('Something went wrong!');
        } else {
            res.render('index', {dogs: dogs});
        }
    });
});

app.get('/dogs/new', function(req, res) {
    res.render('newDog');
});

app.get('/dogs/edit/:id', function(req, res) {
    Dog.findById(req.params.id, function(err, dog) {
        if(err) {
            console.log('Something went wrong!');
        } else {
            res.render('edit', {dog: dog});
        }
    })
});

app.get('/dogs/destroy/:id', function(req, res) {
    Dog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log('Something went wrong!');
        } else {
            res.redirect('/');
        }
    })
});

app.post('/dogs/:id', function(req, res) {
    Dog.findByIdAndUpdate(req.params.id, req.body, function(err, dog) {
        if(err) {
            res.render('edit', {errors: dog.errors});
            console.log('Something went wrong!');
        } else {
            res.redirect('/dogs/' + req.params.id);
        }
    });
});


app.get('/dogs/:id', function(req, res) {
    Dog.findById(req.params.id, function(err, dog) {
        if(err) {
            console.log('Something went wrong!');
        } else {
            res.render('dog', {dog: dog});
        }
    })
})


app.post('/dogs', function(req, res) {
    var dog = new Dog({breed: req.body.breed, image: req.body.image});
    dog.save(function(err) {
        if(err) {
            res.render('newDog', {errors: dog.errors});
        } else {
            res.redirect('/');
        }
    });
});

app.listen(8000, function() {
    console.log('Server listening on port 8000...');
});

