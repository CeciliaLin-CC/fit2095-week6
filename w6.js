//Import packages
const express = require("express");
const morgan = require("morgan");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
//Configure Express
const app = express();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use('/css',express.static(__dirname + '/css'));
app.use('/images',express.static(__dirname + '/images'));
// app.use('/public',express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"));
app.listen(8080);

//
mongoose.connect('mongodb://localhost:27017/DB', function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
});



app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/getAllDoc", function (req, res) {
    Doctor.find({}, function (err, data) {
        res.render("getAllDoc.html", { bDb: data });
      });
});

app.get("/getAllPAt", function (req, res) {
    Patient.find({}, function (err, data) {
        res.render("getAllPat.html", { bDb: data });
      });
});


app.get('/newDoc', function (req, res) {
    res.sendFile(__dirname + '/views/newDoc.html');
});
app.post("/newDoc", function (req, res) {
    let docDetails = req.body;
    var newdoc = new Doctor({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: docDetails.dfn,
            lastName: docDetails.dln
        },
        dateOfBirth: docDetails.ddb,
        address: {
            state: docDetails.dstate,
            suburb: docDetails.dsuburb,
            street: docDetails.dstreet,
            unit: docDetails.dunit
        },
        numPatients: docDetails.dnp
});
    newdoc.save(function (err) {
        if (err) {
            console.log('Failed to add Doctor to DB',err);
            res.redirect('/views/invalid.html');

        }else{
            console.log('Doctor successfully add to DB');
            res.redirect("/getAllPat"); 
        };
    });
    //res.redirect("/getAllPat"); 
});

app.get('/newPat', function (req, res) {
    res.sendFile(__dirname + '/views/newPat.html');
});
app.post("/newPat", function (req, res) {
    let patDetails = req.body;
    var newpat = new Patient({
        _id: new mongoose.Types.ObjectId(),
        fullName: patDetails.pname,
        doctor: patDetails.pdoctor,
        age: patDetails.page,
        dateOfVisit: patDetails.pdv,
        caseDescription: patDetails.pcase
    });
    Doctor.findByIdAndUpdate(  {_id:patDetails.pdoctor} , { $inc: { 'numPatients': 1 } },{new: true}, function (err, doc) {
        if (err) {
            console.log('Failed to update',err);
            res.redirect('/views/invalid.html');
        }else{
            newpat.save(function (err) {
                if (err) {
                    console.log('Failed to add patient to DB',err);
                    res.redirect('/views/invalid.html');
        
                }else{
                    console.log('Patient successfully add to DB');
                    res.redirect("/getAllPat"); 
                };
                
            }); 
        };
    });
});

app.get('/updateDoc', function (req, res) {
    res.sendFile(__dirname + '/views/updateDoc.html');
});
app.post("/updateDoc", function (req, res) {
    let details = req.body;
    Doctor.findByIdAndUpdate( { '_id':details.did} , { $set: { 'numPatients': details.dnp } },{new: true}, function (err, doc) {
        if (err) {
            console.log('Failed to update',err);
            res.redirect('/views/invalid.html');
        }else{
            res.redirect("/getAllPat"); 
        };
    });
    // res.redirect("/getAllPat"); 
});

app.get('/deletePat', function (req, res) {
    res.sendFile(__dirname + '/views/deletePat.html');
});
app.post('/deletePat', function (req, res) {
    let details = req.body;
    Patient.deleteMany({ 'fullName': details.pname }, function (err, doc) {
        if (err) {
            console.log('Failed to delete',err);
            res.redirect('/views/invalid.html');
        }else{
            res.redirect("/getAllPat"); 
        };  
    });
    // res.redirect("/getAllPat"); 
});

app.get('/listdoctors/:sta', function (req, res) {
    let s = req.params.sta;
    let state;

    switch(s) {
        case "NewSouthWales":
            state = 'NSW';
            break;
        case "Queensland":
            state = 'QLD';
            break;
        case "SouthAustralia":
            state = 'SA';
            break;
        case "Tasmania":
            state = 'TAS';
            break;
        case "Victoria":
            state = 'VIC';
            break;
        case "WesternAustralia":
            state = 'WA';
            break;
        default:
            state = 'VIC';
    };

    Doctor.find({'state': state}, function (err, data) {
        res.render("getAllDoc.html", { bDb: data });
      });
    
});


// app.get('/searchBook', function (req, res) {
//   res.sendFile(__dirname + '/views/getBook.html');
// });
// app.post('/searchBook', function (req, res) {
//   let searchB = req.body.ntitle;
//   db.collection("books").find({title:{$regex:searchB}})
//   .toArray(function (err, result) {
//     res.render("getAllBooks.html", { bDb: result });
//   }); 

// });


app.get('*', function(req, res){
    res.sendFile(__dirname + '/views/404.html');
  });
