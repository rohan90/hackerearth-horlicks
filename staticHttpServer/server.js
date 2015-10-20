var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

mongoose.connect('mongodb://localhost/holycow');


var scoreSchema = new mongoose.Schema({
    score: Number,
    timeChallenge: Number,
    timePlayed: Number,
    comment: 'string',
    createdOn: {type: Date}
});
scoreSchema.pre('save', function (next) {

    now = new Date();
    if (!this.createdOn) {
        this.createdOn = now;
    }
    this.id = this._id;
    next();
});
var ScoreModel = mongoose.model('score', scoreSchema);

var oneDay = 86400000;

app.use(express.compress());
app.use(express.static(process.cwd() + '/app', {maxAge: oneDay}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});
app.use(bodyParser.json());


var dirUrl = process.cwd() + '/app';

app.post('/api/save', function (req, res) {
    console.log('received request for a saving a score :' + JSON.stringify(req.body));
    var data = req.body;

    var score = new ScoreModel(data);
    score.save(data, function (err, docs) {
        if (err) {
            res.status(500);
            res.json({
                status: false,
                error: err
            })
        } else {
            res.status(201);
            res.json({
                status: true,
                data: docs
            })
        }
    })
});
app.get('/api/scores', function (req, res) {
    console.log('received request for a fetching scores');
    ScoreModel.find({}, function (err, docs) {
        if (err) {
            res.status(500);
            res.send({status: false, error: err});
        }
        else {
            res.status(200);
            res.send({status: true, data: docs});
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function (err) {
    if (err)
        console.error(err)
    else
        console.log('App is ready at : ' + port)
})