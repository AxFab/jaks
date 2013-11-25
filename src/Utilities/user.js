
var User = function () {

  var prv = {
    email: "",
  }

  // -------------------------------------------------------------------------
  /** Gets the user's email address, if available.
   */
  this.getEmail = function () 
  {
    return prv.email;
  }
}

