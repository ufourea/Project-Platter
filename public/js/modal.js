jQuery(document).ready(function($){
	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_forgot_password = $form_modal.find('#cd-reset-password'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
		$switch_login = $form_login.find('.switch_login a'),
		$switch_signup = $form_signup.find('.switch_signup a'),
		$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
        secondaryNav = $('.nav-wrapper'),
		$main_nav = $('.main-nav');

	//open modal
	$main_nav.on('click', function(event){

		if( $(event.target).is($main_nav) ) {
			// on mobile open the submenu
			$(this).children('ul').toggleClass('is-visible');
		} else {
			// on mobile close submenu
			$main_nav.children('ul').removeClass('is-visible');
			//show modal layer
			$form_modal.addClass('is-visible');	
			//show the selected form
			( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
		}

	});

	//close modal
	$('.cd-user-modal').on('click', function(event){
		if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
			$form_modal.removeClass('is-visible');
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$form_modal.removeClass('is-visible');
	    }
    });

	//switch from a tab to another
	$form_modal_tab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
	});

	$switch_login.on('click', function(event){
		event.preventDefault();
		signup_selected();
	});

	$switch_signup.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	//hide or show password
	$('.show-password').on('click', function(){
		var $this= $(this),
			$password_field = $this.prev('input');
		
		( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
		( 'Show' == $this.text() ) ? $this.text('Hide') : $this.text('Show');
		//focus and move cursor to the end of input field
		$password_field.putCursorAtEnd();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

    secondaryNav.find('ul a').on('click', function(event){
        event.preventDefault();
        var target= $(this.hash);
         if (target.length) {
        $('body,html').animate({
            'scrollTop': target.offset().top - secondaryNav.height() + 60
            }, 600
        ); 
      }else{
          $('body,html').animate({
            scrollTop: 0
        }, 600);
      }
        
    });

	function login_selected(){
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}


	$("body").on("click", "#menuLogoutBtn", function() {
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
        $("#menuHomeBtn").show();
        $("#menuAboutBtn").show();
        $("#menuHowBtn").show();
    	$("#LoginModalBtn").show();
    	$("#menuLogoutBtn").hide();
    contentLoader("home.html");
     $form_modal.removeClass('is-visible');
});

	$("body").on("click", "#loginBtn", function() {
    $(".loginElement").each(function() {
        if ($(this).hasClass("invalid")) {
            $(this).removeClass("invalid");
        }
    });
    $.ajax({
        method: "POST",
        url: "verifyUser",
        data: {
            "email": $("#txtEmail").val(),
            "password": $("#txtPwd").val()
        },
        success: function(res) {
            if (res.toLowerCase() == "invalid username") {
                $("#txtEmail").addClass("invalid");
                alert("Invalid Email");

            } else if (res.toLowerCase() == "invalid password") {
                $("#txtPwd").addClass("invalid");
                alert("Invalid Password");
    
            } else if (res.toLowerCase().indexOf("isn't yet activated") != "-1") {
                alert(res);

            } else {
                contentLoader("dashboard.html");
                $("#LoginModalBtn").hide();
                $("#menuHomeBtn").show();
                $("#menuAboutBtn").hide();
                $("#menuHowBtn").hide();
                $("#menuLogoutBtn").show();
                var res = JSON.parse(res);
                localStorage.setItem("userId", res.id);
                localStorage.setItem("isAdmin", res.admin);
                $form_modal.removeClass('is-visible');
            }
        }
    })
});

$("body").on("click", "#signUpBtn", function() {
    var currentId = genGuid();
    var isValid = true;
    $(".signUpElements").each(function() {
        if ($(this).val() == "") {
            $(this).addClass("invalid");
        } else {
            $(this).removeClass("invalid");
        }
    });
    
    $(".signUpElements").each(function() {
        if ($(this).hasClass("invalid")) {
            isValid = false;
        }
    });
    if (isValid) {
        var loadingDivId = "contentContainer";
        var url = "addUser";
        var data = {
            "firstname": $("#txtName").val(),
            "email":$("#txtEmail1").val(),
            "monbileno": $("#txtMobileNo").val(),
            "password": $("#txtPassword").val(),
            "id": currentId
        };
        sendAjaxReq(loadingDivId, url, data);
    }
});

function genGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function sendAjaxReq(loadingDivId, url, data) {
    $.ajax({
        method: "POST",
        url: url,
        data: data,

        success: function(res) {
            $(".signUpElements").each(function() {
                if ($(this).hasClass("invalid")) {
                    $(this).removeClass("invalid");
                }
            });
            if (res.toLowerCase() == "already registered with given email id") {
                $("#txtEmail").addClass("invalid");
                alert("already registered with given email id");
                
            } else {
                
                alert("Activation mail has been sent to your registered email Id");
               login_selected();
                
            }
        }
    });
}
    

	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	
});

//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};