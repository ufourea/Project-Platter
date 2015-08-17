var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');
var nodeMailer = require('./nodemailer.js');
var paypal = require('paypal-rest-sdk');
// paypal auth configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AcIDoGIiW2RGa_I-C9nGy6x4MuueX4Ok7lCwv0DqvJbZOXWoNhDP6f_LrD1RJkynyTRX0ALJFbdJeK-K',
  'client_secret': 'ENqyZH-Uy3GeP6iQqqH-6aQWEFj7LMyu3NNmoIIya6FM4J5M7aZrHAgBWf_DjRKN2W49icAVz1MLke3v'
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

var upload = multer({dest:'uploads/'});
app.use(express.static("public"));
app.get("/", function(req, res) {
    res.sendFile("index.html");
});

app.post('/addUser', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.email == currentUser.email) {
                    return res.end("Already registered with given email id");
                }
            }
        }
        triedUser.active = false;
        var date = new Date();
        triedUser.dateofjoin = date;
        nodeMailer.sendActivateEmail(triedUser.email, triedUser.firstname, "http://projectplatter.com/activateUser/" + triedUser.id);
        users.push(JSON.parse("{\"user\":" + JSON.stringify(triedUser) + "}"));
        fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
            if (err) {
                consoe.log(err);
            }
            return res.end("User added successfully");
        });
    });
});
app.get('/activateUser/:id', function(req, res) {
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser.id == req.params.id) {
                currentUser.active = true;
                fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
                    if (err) {
                        consoe.log(err);
                    }
                    return res.end("User added successfully");
                });

                return res.end("Your account has been activated successfully.");
            }
        }
        return res.end("No user found with given Id");
    });
});
app.post('/verifyUser', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var users = JSON.parse(data).users;
        for (i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (triedUser.email == currentUser.email) {
                if (triedUser.password == currentUser.password) {
                    if (currentUser.active) {
                        if(currentUser.admin){
                            return res.end(JSON.stringify({"id":currentUser.id,"admin":currentUser.admin}));
                        }
                        else{
                            return res.end(JSON.stringify({"id":currentUser.id,"admin":false}));
                        }
                    } else {
                        return res.end("Your account isn't yet activated. Please verify your registered mail Id for email containing your ProjectPlatter account activation details");
                    }
                } else {
                    return res.end("Invalid password");
                }
            }
        }
        return res.end("Invalid username");
    });
});
app.post('/verifyId', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var users = JSON.parse(data).users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (triedUser.id == currentUser.id) {
                return res.end("Valid Id");
            }
        }
        return res.end("Invalid Id");
    });
});
app.post('/getProfile', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    return res.end(JSON.stringify(currentUser));
                }
            }
        }
    });
});
app.post('/getSettings', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    return res.end(JSON.stringify(currentUser));
                }
            }
        }
    });
});
app.post('/getFinancials', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    return res.end(JSON.stringify(currentUser));
                }
            }
        }
    });
});
app.post('/saveDetails', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    if (triedUser.firstname) {
                        currentUser.firstname = triedUser.firstname;
                    }
                    if (triedUser.lastname) {
                        currentUser.lastname = triedUser.lastname;
                    }
                    if (triedUser.city) {
                        currentUser.city = triedUser.city;
                    }
                    if (triedUser.address) {
                        currentUser.address = triedUser.address;
                    }
                    if (triedUser.state) {
                        currentUser.state = triedUser.state;
                    }
                    if (triedUser.country) {
                        currentUser.country = triedUser.country;
                    }
                    if (triedUser.postalcode) {
                        currentUser.postalcode = triedUser.postalcode;
                    }
                    break;
                }
            }
        }
        fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
            if (err) {
                consoe.log(err);
            }
            return res.end("Details saved successfully");
        });
    });
});
app.post('/updateEmail', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    if (triedUser.password == currentUser.password) {
                        if (triedUser.email) {
                            currentUser.email = triedUser.email;
                        }
                        break;
                    } else {
                        res.end("Incorrect password");
                    }
                }
            }
        }
        fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
            if (err) {
                consoe.log(err);
            }
            return res.end("Email updated successfully");
        });
    });
});
app.post('/updatePassword', function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    if (triedUser.password == currentUser.password) {
                        if (triedUser.newpwd) {
                            currentUser.password = triedUser.newpwd;
                        }
                        break;
                    } else {
                        res.end("Incorrect password");
                    }
                }
            }
        }
        fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
            if (err) {
                consoe.log(err);
            }
            return res.end("Password updated successfully");
        });
    });
});
app.post("/updateProfile", function(req, res) {
    var triedUser = req.body;
    fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var users = data.users;
        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i].user;
            if (currentUser != null) {
                if (triedUser.id == currentUser.id) {
                    if (triedUser.bio) {
                        currentUser.bio = triedUser.bio;
                    }
                    break;
                }
            }
        }
        fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
            if (err) {
                consoe.log(err);
            }
            return res.end("Profile updated successfully");
        });
    });
});
app.post('/getProjectBasedOnId', function(req, res) {
    var project = req.body;
    fs.readFile(__dirname + "/public//data/projects.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var projects = data.projects;
        var selectedProj = "";
        for (var i = 0; i < projects.length; i++) {
            var currentProj = projects[i].project;
            if (currentProj.id == project.id) {
                selectedProj = JSON.stringify(JSON.parse("{\"project\":" + JSON.stringify(currentProj) + "}"));
                break;
            }
        }
        return res.end(selectedProj);
    });
});
app.post('/getProjects', function(req, res) {
    var user = req.body;
    fs.readFile(__dirname + "/public//data/projects.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var projects = data.projects;
        var respProjects = {"projects":[]};
        for (var i = 0; i < projects.length; i++) {
            var currentProj = projects[i].project;
            if (currentProj.id.split("_")[0] == user.id) {
                respProjects.projects.push(JSON.parse("{\"project\":" + JSON.stringify(currentProj) + "}"));
            }
        }
        return res.end(JSON.stringify(respProjects));
    });
});
app.post('/getAllProjects', function(req, res) {
    var user = req.body;
    fs.readFile(__dirname + "/public//data/projects.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var projects = data.projects;
        var respProjects = {"projects":[]};
        for (var i = 0; i < projects.length; i++) {
            var currentProj = projects[i].project;
            respProjects.projects.push(JSON.parse("{\"project\":" + JSON.stringify(currentProj) + "}"));
        }
        return res.end(JSON.stringify(respProjects));
    });
});
app.post("/uploadAttachment",upload.single('attachfile'),function(req,res){
	fs.readFile(req.file.path, function (err, data){
		 var newPath = __dirname + "/uploads/" + req.file.originalname;
      fs.writeFile(newPath, data, function (err) {
      	res.end("File Uploaded");
      });
    });
});
app.post('/saveProject', function(req, res) {
    var newProject = req.body;
    fs.readFile(__dirname + "/public//data/projects.json", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(data);
        var projects = data.projects;
        var projectId = projects.length + 1;
        var date = new Date();
        newProject.createddate = date;
        newProject.id = newProject.id + "_proj_" + projectId;
        projects.push(JSON.parse("{\"project\":" + JSON.stringify(newProject) + "}"));
        fs.writeFile(__dirname + "/public//data/projects.json", JSON.stringify(data), function(err) {
            if (err) {
                consoe.log(err);
            }
            fs.readFile(__dirname + "/public//data/users.json", "utf-8", function(err, data) {
                if (err) {
                    console.log(err);
                }
                var data = JSON.parse(data);
                var users = data.users;
                for (var i = 0; i < users.length; i++) {
                    var currentUser = users[i].user;
                    if (currentUser != null) {
                        if (newProject.id.split("_")[0] == currentUser.id) {
                            if (currentUser.projectsids) {
                                currentUser.projectsids.push(newProject.id);
                            } else {
                                currentUser.projectsids = [];
                                currentUser.projectsids.push(newProject.id);
                            }
                            break;
                        }
                    }
                }
                fs.writeFile(__dirname + "/public//data/users.json", JSON.stringify(data), function(err) {
                    if (err) {
                        consoe.log(err);
                        return res.end("Failed to save project. Please retry");
                    }
                    return res.end("Project saved successfully");
                });
            });
        });
    });
});
app.post('/paynow', function(req, res) {
    // paypal payment configuration.
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": app.locals.baseurl + "/success",
            "cancel_url": app.locals.baseurl + "/cancel"
        },
        "transactions": [{
            "amount": {
                "total": parseInt(req.body.amount),
                "currency": req.body.currency
            },
            "description": req.body.description
        }]
    };

    paypal.payment.create(payment, function(error, payment) {
        if (error) {
            console.log(error);
        } else {
            if (payment.payer.payment_method === 'paypal') {
                req.paymentId = payment.id;
                var redirectUrl;
                console.log(payment);
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            }
        }
    });
});
var server = app.listen(8082, function(err) {
    var host = server.address().host;
    var port = server.address().port;
    if (err) {
        console.log(err);
    }
    console.log("Example app listening at http://%s:%s", host, port);
});
