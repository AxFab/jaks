
var Session = {}

// ---------------------------------------------------------------------------
/** Gets information about the current user.
 */
Session.getActiveUser = function ()
{
  return new User();
}


// ---------------------------------------------------------------------------
/** Gets the language setting of the current user as a two-letter string
 */
Session.getActiveUserLocale = function ()
{
  return "en";
}


// ---------------------------------------------------------------------------
/** Gets information about the user under whose authority the script is running.
 */
Session.getEffectiveUser = function () 
{
  return Session.getActiveUser();
}

// ---------------------------------------------------------------------------
/** Gets the time zone of the script.
 */
Session.getScriptTimeZone = function () 
{
  return Session.getActiveUserLocale();
}

