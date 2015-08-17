var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'project.platter@gmail.com',
        pass: 'platter@7'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var sendActivateEmail = function sendEmail(userMail,first_name,url) {
    var htmlBody = "<p>Hi "+first_name+",</p><p>Welcome to the world of problem solvers. Please click on below link to activate your <b>Projectplatter</b> account</p>"+
    "<p><a href='"+url+"' target='new'>Activate my Projectplatter account</a></p><p>with best Regards,</p><p>Projectplatter team</p>";
    var mailOptions = {
        from: 'Projectplatter team<project.platter@gmail.com>', // sender address
        to: userMail, // list of receivers
        subject: 'Projectplatter Activation mail ✔', // Subject line
        html: htmlBody // html body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}
exports.sendActivateEmail = sendActivateEmail;
