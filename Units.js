
var Utilities = require('./src/Utilities/utilities.js').Utilities;

// ===========================================================================
var _tests = 0, _succeed = 0;
var TestModule = function (name) 
{
  if (_tests != 0 ) {
    console.log (_succeed + " tests succeed on " + _tests + ": " + (_succeed*100/_tests).toFixed(2) + " % \n")
  }
  console.log ("*** TEST " + name + " ********");
  _tests = 0;
  _succeed = 0;
}

var Test_Equals = function (expected, result) 
{
  if (expected === result) {
    _succeed++;
    console.log ("#" + (++_tests) + " \t[\033[32mOK\033[0m]");
  } else {
    console.log ("#" + (++_tests) + " \t[\033[31mErr\033[0m]");
  }
}


// ===========================================================================
TestModule ("Utilities")

Test_Equals ("05 Jun 31", Utilities.formatDate(new Date(25,11,2013), "dd mmm yy"))
Test_Equals ("Friday, 05 June 1931", Utilities.formatDate(new Date(25,11,2013), "dddd, dd mmmm yyyy"))

Test_Equals ('[["1","3","4","6"],["9","4","6"]]', JSON.stringify(Utilities.parseCsv("1,3,4,6\n9,4,6")))


// ===========================================================================
TestModule ("ENDED")

