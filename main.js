var request = require('superagent');

function disableScrolling(){
  var x=window.scrollX;
  var y=window.scrollY;
  window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
  window.onscroll=function(){};
}

function submitform(){
  var loader = document.getElementById("loader-bg");
  var fullname =  document.getElementById("fullname").value;
  var email =  document.getElementById("email").value;
  var mobile =  document.getElementById("mobilephone").value;
  var typeSelect =  document.getElementById("type");
  var type =  typeSelect.options[typeSelect.selectedIndex].value;
  var rid =  document.getElementById("rid").value;
  var postal = document.getElementById("postalCode").value;
  var referral_code = document.getElementById('referralcode').value;
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;
  var checkbox_tnc = document.getElementById('accept_tnc');
  var messages = [];
  if(checkbox_tnc.checked){
    if (type.trim() == "" ){
      messages.push("Please select what you are registering as.");
    }
    if (fullname.trim() == "" && type.trim() != "Other"){
      messages.push("Invalid/Blank full name");
    }
    // if (rid.trim() == ""){
    //   messages.push("Invalid/Blank registration number");
    // }
    if (email.trim() == "" || email.indexOf("@") < 1 ){
      messages.push("Invalid/Blank email");
    }
    if (password.trim() == "" ){
      messages.push("Invalid/Blank password");
    } else if (password.trim().length < 8) {
      messages.push("Password needs to be at least 8 characters long");
    }
    if (confirmPassword.trim() != password.trim()){
      messages.push("Passwords do not match");
    }
    if (mobile.trim() == "" || mobile.toString().length != 8 ){
      messages.push("Invalid/Blank mobile phone");
    }
    if (postal.trim() == ""){
      messages.push("Invalid/Blank home postal code");
    }
    // if (referral_code.trim() == "" ){
    //   messages.push("Invalid/Blank referral code");
    // }

    if (messages.length > 0 ){
      alert(messages.join('\n'));
    } else {
      loader.style.display = 'block';
      disableScrolling();
      var jsonParams = {
        "name" : fullname,
        "email" : email,
        "mobilePhone" : mobile,
        "uid" : rid,
        "type" : type,
        "postalCode" : postal,
        "promoCode" : referral_code,
        "password": password.trim(),
        "cpassword": confirmPassword.trim()
      }
      var url = (window.location.hostname.indexOf('www.ebeepartners.com') > -1) ? 'https://api.ebeecare.com' : 'http://dev.ebeecare.com';

      request
        .post(url + '/api/registerPartner')
        .send(jsonParams)
        .end(function(err, res) {
          if (err) {
            loader.style.display = 'none';
            alert("Error!");
            enableScrolling();
          } else {
            loader.style.display = 'none';
            // console.log(res);
            if (res.body.status == 1) {
                alert("Thank you for signing up as our healthcare professional!");
                ga('send', 'event', 'account', 'registration', 'Nurse', 1);
                window.location = "https://app.ebeecare.com/";
            } else {
               alert("Oops, " + res.body.message + " \n Error(s): "+res.body.errors);
               ga('send', 'event', 'account', 'registration', 'Nurse', 0);
            }
            enableScrolling();
          }
        });
    }
  }else{
    alert("Please accept our Terms of Service and Privacy Policy before proceeding with account sign up.");
  }
}

function run() {
  document.getElementById('submit').onclick = submitform;
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
