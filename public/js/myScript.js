$(document).ready(function() {

    $("#contentContainer").css("min-height", $("body").height() * 125 / 100);
    if (isValidId(localStorage.getItem("userId"))) {
        contentLoader("dashboard.html");
        $("#LoginModalBtn").hide();
        $("#menuHomeBtn").show();
        $("#menuAboutBtn").hide();
        $("#menuHowBtn").hide();
        $("#menuLogoutBtn").show();
        $("#prof_pic").show();
    } else {
        contentLoader("home.html");
        $("#menuLogoutBtn").hide();
        $("#prof_pic").hide();
    }
});

$("body").on("click", "#menuLoginBtn", function() {
    if (isValidId(localStorage.getItem("userId"))) {
        $("#menuLoginBtn").hide();
        $("#menuSignUpBtn").hide();
        $("#menuLogoutBtn").show();
        contentLoader("dashboard.html");
    } else {
        contentLoader("login.html");
        $("#menuLoginBtn").show();
        $("#menuSignUpBtn").show();
        $("#menuLogoutBtn").hide();
    }
});
$("body").on("click", "#getStartedBtn", function() {
    if (isValidId(localStorage.getItem("userId"))) {
        dashboardContentLoader("postassign.html");
    } else {
        contentLoader("signup.html");
    }
});
$("body").on("click", "#menuSignUpBtn", function() {
    if (isValidId(localStorage.getItem("userId"))) {
        contentLoader("dashboard.html");
    } else {
        contentLoader("signup.html");
    }
});
$("body").on("click", "#menuHomeBtn", function() {
    if (isValidId(localStorage.getItem("userId"))) {
        contentLoader("dashboard.html");
    } else {
        contentLoader("home.html");
    }

});
$("body").on("click", "#menuPostBtn", function() {
    if (isValidId(localStorage.getItem("userId"))) {
        dashboardContentLoader("postassign.html");
    } else {
        contentLoader("signup.html");
    }
});



$("body").on("click", "#dashboardSettingsBtn", function() {
    dashboardContentLoader("settings.html");
    $.ajax({
        url: "/getSettings",
        method: "POST",
        data: {
            "id": localStorage.getItem("userId")
        },
        success: function(user) {
            var user = JSON.parse(user);
            if (user.firstname) {
                $("#firstName").val(user.firstname).focus();
            }
            if (user.lastname) {
                $("#lastName").val(user.lastname).focus();
            }
            if (user.address) {
                $("#address").val(user.address).focus();
            }
            if (user.city) {
                $("#city").val(user.city).focus();
            }
            if (user.state) {
                $("#state").val(user.state).focus();
            }
            if (user.postalcode) {
                $("#postalCode").val(user.postalcode).focus();
            }
            if (user.openprojects) {
                $("#country").val(user.country).focus();
            }
        }
    });
});
$("body").on("click", "#dashboardProfileBtn", function() {
    dashboardContentLoader("profile.html");
    $.ajax({
        url: "/getProfile",
        method: "POST",
        data: {
            "id": localStorage.getItem("userId")
        },
        success: function(user) {
            var user = JSON.parse(user);
            if (user.firstname && user.lastname) {
                $("#profileUserName").html(user.firstname + " " + user.lastname);
            }
            if (user.city && user.state && user.country) {
                $("#profileLocation").html(user.city + ", " + user.state + ", " + user.country);
            }
            if (user.dateofjoin) {
                $("#profileDoj").html(user.dateofjoin);
            }
            if (user.bio) {
                $("#profileBio").html(user.bio);
            }
            if (user.pic) {
                $("#profileImg").attr("src", user.pic);
            }
            if (user.openprojects) {
                $("#openProjects").html(user.openprojects);
            }
            if (user.activeprojects) {
                $("#activeProjects").html(user.activeprojects);
            }
            if (user.pastprojects) {
                $("#pastProjects").html(user.pastprojects);
            }
            if (user.totalprojects) {
                $("#totalProjects").html(user.totalprojects);
            }
        }
    });
});
$("body").on("click", ".projectStickies", function(event) {
    var projectId = $(this).attr("id");
    getProjectBasedOnId(projectId);
});
$("body").on("click", "#dashboardProjectsBtn", function() {
    dashboardContentLoader("projects.html");
    $("#projectsList").html("<li class='col-xs-12 col-md-3 col-sm-4'><a class='stickie' id='menuPostBtn' href='#'' rel='bookmark'><span class='annotation top-right'></span><span  class='headline'><font color='red'><u><b>Create new Project</b></u></font></span><span class='annotation bottom-left'><i class='fa fa-star-o pstar' data-id='oa2zx'></i> <span class='new'></span></span></a></li>");
    if (localStorage.getItem("isAdmin") == "true") {
        loadAllProjects();
    } else {
        loadProjects();
    }
});
$("body").on("click", "#dashboardFinancialsBtn", function() {
    dashboardContentLoader("financial.html");
    $.ajax({
        url: "/getFinancials",
        method: "POST",
        data: {
            "id": localStorage.getItem("userId")
        },
        success: function(user) {
            var user = JSON.parse(user);
            if (user.firstname) {
                $("#name").val(user.firstname + " " + user.lastname).focus();
            }
            if (user.monbileno) {
                $("#phone").val(user.monbileno).focus();
            }
            if (user.email) {
                $("#email").val(user.email).focus();
            }
            if (user.address) {
                $("#address").val(user.address).focus();
            }
            if (user.city) {
                $("#city").val(user.city).focus();
            }
            if (user.state) {
                $("#state").val(user.state).focus();
            }
            if (user.postalcode) {
                $("#postalCode").val(user.postalcode).focus();
            }
            if (user.openprojects) {
                $("#country").val(user.country).focus();
            }
        }
    });
});
$("body").on("click", "#dashboardInviteBtn", function() {
    dashboardContentLoader("invite.html");
});
$("body").on("click", "#editProfileBtn", function() {
    var bio = $("#profileBio").text();
    $("#profileBio").html("<textarea id='profileBioTextArea'>" + bio + "</textarea>");
});
$("body").on("click", "#saveDetailsBtn", function() {
    var user = {};
    if (isValidId(localStorage.getItem("userId"))) {
        user.id = localStorage.getItem("userId");
        if ($("#firstName").val() != "") {
            user.firstname = $("#firstName").val();
        }
        if ($("#lastName").val() != "") {
            user.lastname = $("#lastName").val();
        }
        if ($("#city").val() != "") {
            user.city = $("#city").val();
        }
        if ($("#state").val() != "") {
            user.state = $("#state").val();
        }
        if ($("#country").val() != "") {
            user.country = $("#country").val();
        }
        if ($("#postalCode").val() != "") {
            user.postalcode = $("#postalCode").val();
        }
        if ($("#address").val() != "") {
            user.address = $("#address").val();
        }
        $.ajax({
            url: "/saveDetails",
            method: "post",
            data: user,
            success: function(resp) {
                alert(resp);
            }
        });
    } else {

         alert("Invalid User Id");
    }
});
$("body").on("click", "#updateEmailBtn", function() {
    var user = {};
    $("#currPwd").removeClass("invalid");
    if (isValidId(localStorage.getItem("userId"))) {
        user.id = localStorage.getItem("userId");
        if ($("#updateEmail").val() != "" && !$("#updateEmail").hasClass("invalid")) {
            user.email = $("#updateEmail").val();
            if ($("#currPwd").val()) {
                user.password = $("#currPwd").val();
                $.ajax({
                    url: "/updateEmail",
                    method: "post",
                    data: user,
                    success: function(resp) {
                         alert(resp);
                    }
                });
            } else {
                 alert("Invalid password");
                $("#currPwd").addClass("invalid");
            }
        } else {
              alert("Invalid Email Id");
            $("#currPwd").addClass("invalid");
        }
    } else {
         alert("Invalid User Id");
    }
});
$("body").on("click", "#updatePasswordBtn", function() {
    var user = {};
    $("#pwd").removeClass("invlaid");
    $("#cnfPwd").removeClass("invlaid");
    $("#newPwd").removeClass("invlaid");
    if (isValidId(localStorage.getItem("userId"))) {
        user.id = localStorage.getItem("userId");
        if ($("#pwd").val() != "") {
            user.password = $("#pwd").val();
            if ($("#newPwd").val() == $("#cnfPwd").val()) {
                user.newpwd = $("#newPwd").val();
                $.ajax({
                    url: "/updatePassword",
                    method: "post",
                    data: user,
                    success: function(resp) {
            
                         alert(resp);
                    }
                });
            } else {
               
                 alert("Passwords do not match");
                $("#newPwd").addClass("invalid");
                $("#cnfPwd").addClass("invalid");
            }
        } else {
            
             alert("Invalid Password");
            $("#pwd").addClass("invalid");
        }
    } else {
        
         alert("Invalid User Id");
    }
});
$("body").on("click", "#saveProfileBtn", function() {
    var user = {};
    if (isValidId(localStorage.getItem("userId"))) {
        user.id = localStorage.getItem("userId");
        user.bio = $("#profileBioTextArea").val();
        $.ajax({
            url: "/updateProfile",
            method: "post",
            data: user,
            success: function(resp) {
                alert(resp);
                $("#profileBio").html(user.bio);
            }
        });
    } else {
        alert("Invalid User Id");
    }
});
$("body").on("click", "#postProjectBtn", function() {
    var projectCategory = $("#projectCategory").val();
    var projectName = $("#projectName").val();
    var projectSkills = $("#projectSkills").val();
    var projectDetails = $("#projectDetails").val();
    var attachments = $("#attachFile").val();
    var budget = $("#budget").val();
    var currency = $("#currency").val();
    $("#projectCategory").removeClass("invalid");
    $("#projectName").removeClass("invalid");
    $("#projectDetails").removeClass("invalid");
    $("#budget").removeClass("invalid");
    $("#currency").removeClass("invalid");
    if ($("#projectCategory").prop("selectedIndex") == 0) {
        $('#modal1').html("<br>" + "<p>" +"&emsp;&emsp;&emsp;"+"Please choose a project category" + "</p>" + "<br>");
        $('#modal1').openModal();
        $("#projectCategory").addClass("invalid");
        return;
    }
    if ($("#projectName").val() == "") {
         $('#modal1').html("<br>" + "<p>" +"&emsp;&emsp;&emsp;"+"Please provide a name to your project" + "</p>" + "<br>");
        $('#modal1').openModal();
        $("#projectName").addClass("invalid");
        return;
    }
    if ($("#projectDetails").val() == "") {
         $('#modal1').html("<br>" + "<p>" +"&emsp;&emsp;&emsp;"+"Please provide project details" + "</p>" + "<br>");
        $('#modal1').openModal();
        $("#projectDetails").addClass("invalid");
        return;
    }
    if ($("#budget").val() == "") {
        $('#modal1').html("<br>" + "<p>" +"&emsp;&emsp;&emsp;"+"Please provide a budget for you project" + "</p>" + "<br>");
        $('#modal1').openModal();
        $("#budget").addClass("invalid");
        return;
    }
    if ($("#currency").prop("selectedIndex") == 0) {
        $('#modal1').html("<br>" + "<p>" +"&emsp;&emsp;&emsp;"+"Please choose your currency" + "</p>" + "<br>");
        $('#modal1').openModal();
        $("#currency").addClass("invalid");
        return;
    }
    $("#assignConfirmDiv1").append("<table>" + "<tr><td>Category</td><td>" + projectCategory + "</td></tr>" + "<tr><td>Name</td><td>" + projectName + "</td></tr>" + "<tr><td>Skills</td><td>" + projectSkills + "</td></tr>" + "<tr><td>Details</td><td>" + projectDetails + "</td></tr>" + "<tr><td>Attachments</td><td>" + attachments + "</td></tr>" + "<tr><td>Budget</td><td>" + budget + " " + currency + "</td></tr>" + "<table>");
    $("#assignConfirmDiv").show();
    $("#postAssignDiv").hide();
});
$("body").on("click", "#cancelProjectSubmitBtn", function() {
    $("#assignConfirmDiv").hide();
    $("#postAssignDiv").show();
});
$("body").on("click", "#submitProjectBtn", function() {
    var projectCategory = $("#projectCategory").val();
    var projectName = $("#projectName").val();
    var projectSkills = $("#projectSkills").val();
    var projectDetails = $("#projectDetails").val();
    var attachments = $("#attachFile").val();
    var budget = $("#budget").val();
    var currency = $("#currency").val();
    var project = {};
    if (isValidId(localStorage.getItem("userId"))) {
        var project = {
            "id": localStorage.getItem("userId"),
            "projectcategory": $("#projectCategory").val(),
            "projectname": $("#projectName").val(),
            "projectskills": $("#projectSkills").val(),
            "projectdetails": $("#projectDetails").val(),
            "attachments": $("#attachFile").val(),
            "budget": $("#budget").val(),
            "currency": $("#currency").val()
        };
        $.ajax({
            url: "/saveProject",
            method: "post",
            data: project,
            success: function(resp) {
                contentLoader("payment.html")
            }
        });
    } else {
        alert("Invalid User Id");
    }

});


function contentLoader(url) {
    $.ajax({
        url: url,
        async: false,
        success: function(data) {
            $("#contentContainer").html(data);
            if (url.toLowerCase() == "dashboard.html") {
                $("#dashboardProjectsBtn").trigger("click");
            }
        }
    });
}

function dashboardContentLoader(url) {
    $.ajax({
        url: url,
        async: false,
        success: function(data) {
            $("#dashboardContentContainer").html(data);
        }
    });
}


function isValidId(userId) {
    var isValid = false;
    $.ajax({
        method: "POST",
        url: "/verifyId",
        data: {
            "id": userId
        },
        async: false,
        success: function(res) {
            if (res.toLowerCase() == "valid id") {
                isValid = true;
            } else if (res.toLowerCase() == "invalid id") {
                isValid = false;
            }
        }
    });
    return isValid;
}

function getProjectBasedOnId(projectId) {
    $.ajax({
        url: "/getProjectBasedOnId",
        method: "post",
        data: {
            "id": projectId
        },
        success: function(project) {
            project = JSON.parse(project).project;
            $("#dashboardContentContainer").html("<table>" + "<tr><td>Category</td><td>" + project.projectcategory + "</td></tr>" + "<tr><td>Name</td><td>" + project.projectname+ "</td></tr>" + "<tr><td>Skills</td><td>" + project.projectskills + "</td></tr>" + "<tr><td>Details</td><td>" + project.projectdetails + "</td></tr>" + "<tr><td>Attachments</td><td>" + project.attachments + "</td></tr>" + "<tr><td>Budget</td><td>" + project.budget + " " + project.currency + "</td></tr>" + "<table>");
        }
    });
}

function loadProjects() {
    $.ajax({
        url: "/getProjects",
        method: "post",
        data: {
            "id": localStorage.getItem("userId")
        },
        success: function(projects) {
            projects = JSON.parse(projects).projects;
            if (projects.length > 0) {
                for (var i = 0; i < projects.length; i++) {
                    var currentProject = projects[i].project;
                    $("#projectsList").append("<li class='col-xs-12 col-md-3 col-sm-4'><a id=" + currentProject.id + " class='stickie projectStickies' href='#' rel='bookmark'><span class='annotation top-right'>" + currentProject.createddate + "</span><span class='headline'><b>Name</b> : " + currentProject.projectname + " <br /><b>Budget</b> : " + currentProject.budget + " " + currentProject.currency + "</span><span class='annotation bottom-left'><i class='fa fa-star-o pstar'></i><span class='new'>New</span></span></a></li>");
                }
            }
        }
    });
}

function loadAllProjects() {
    $.ajax({
        url: "/getAllProjects",
        method: "post",
        data: {
            "id": localStorage.getItem("userId"),
            "admin": localStorage.getItem("isAdmin")
        },
        success: function(projects) {
            projects = JSON.parse(projects).projects;
            if (projects.length > 0) {
                for (var i = 0; i < projects.length; i++) {
                    var currentProject = projects[i].project;
                    $("#projectsList").append("<li class='col-xs-12 col-md-3 col-sm-4'><a id=" + currentProject.id + " class='stickie projectStickies' href='#' rel='bookmark'><span class='annotation top-right'>" + currentProject.createddate + "</span><span class='headline'><b>Name</b> : " + currentProject.projectname + " <br /><b>Budget</b> : " + currentProject.budget + " " + currentProject.currency + "</span><span class='annotation bottom-left'><i class='fa fa-star-o pstar'></i><span class='new'>New</span></span></a></li>");
                }
            }
        }
    });
}
$("body").on("click", "#AboutUsBtn", function() {
        contentLoader("about.html");
         $("#menuAboutBtn").hide();
        $("#menuHowBtn").hide();
        
});
$("body").on("click", "#privacyBtn", function() {
        contentLoader("privacy.html");
         $("#menuAboutBtn").hide();
        $("#menuHowBtn").hide();
         
});
$("body").on("click", "#contactBtn", function() {
        contentLoader("contact.html");
         $("#menuAboutBtn").hide();
        $("#menuHowBtn").hide();
    
});
$("body").on("click", "#termsBtn", function() {
        contentLoader("terms.html");
         $("#menuAboutBtn").hide();
        $("#menuHowBtn").hide();
    
});
$("body").on("click", "#refundBtn", function() {
        contentLoader("refund.html");
         $("#menuAboutBtn").hide();
        $("#menuHowBtn").hide();
    
});