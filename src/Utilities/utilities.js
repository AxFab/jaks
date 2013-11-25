
var Utilities = {}

if (exports) 
  exports.Utilities = Utilities;

// ---------------------------------------------------------------------------
Utilities.extends = function (model, obj) 
{
  for (var k in obj)
    model[k] = obj[k];
  return model;
}

// ---------------------------------------------------------------------------
/** Formats date according to specification described in Java SE 
 * SimpleDateFormat class.
 * @return {String} 
 */
Utilities.formatDate = function (date, mask, utc) 
{
  /* Form Open source code:
   *
   * Date Format 1.2.3
   * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
   * MIT license
   *
   * Includes enhancements by Scott Trenda and Kris Kowal
   */

  var dF = {
    masks:{
      "default":      "ddd mmm dd yyyy HH:MM:ss",
      shortDate:      "m/d/yy",
      mediumDate:     "mmm d, yyyy",
      longDate:       "mmmm d, yyyy",
      fullDate:       "dddd, mmmm d, yyyy",
      shortTime:      "h:MM TT",
      mediumTime:     "h:MM:ss TT",
      longTime:       "h:MM:ss TT Z",
      isoDate:        "yyyy-mm-dd",
      isoTime:        "HH:MM:ss",
      isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    },
    i18n:{
      dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ]
    }
  };


  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };
  
  // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
  if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
    mask = date;
    date = undefined;
  }

  // Passing date through Date applies Date.parse, if necessary
  date = date ? new Date(date) : new Date;
  if (isNaN(date)) throw SyntaxError("invalid date");

  mask = String(dF.masks[mask] || mask || dF.masks["default"]);

  // Allow setting the utc argument via the mask
  if (mask.slice(0, 4) == "UTC:") {
    mask = mask.slice(4);
    utc = true;
  }

  var _ = utc ? "getUTC" : "get",
    d = date[_ + "Date"](),
    D = date[_ + "Day"](),
    m = date[_ + "Month"](),
    y = date[_ + "FullYear"](),
    H = date[_ + "Hours"](),
    M = date[_ + "Minutes"](),
    s = date[_ + "Seconds"](),
    L = date[_ + "Milliseconds"](),
    o = utc ? 0 : date.getTimezoneOffset(),
    flags = {
      d:    d,
      dd:   pad(d),
      ddd:  dF.i18n.dayNames[D],
      dddd: dF.i18n.dayNames[D + 7],
      m:    m + 1,
      mm:   pad(m + 1),
      mmm:  dF.i18n.monthNames[m],
      mmmm: dF.i18n.monthNames[m + 12],
      yy:   String(y).slice(2),
      yyyy: y,
      h:    H % 12 || 12,
      hh:   pad(H % 12 || 12),
      H:    H,
      HH:   pad(H),
      M:    M,
      MM:   pad(M),
      s:    s,
      ss:   pad(s),
      l:    pad(L, 3),
      L:    pad(L > 99 ? Math.round(L / 10) : L),
      t:    H < 12 ? "a"  : "p",
      tt:   H < 12 ? "am" : "pm",
      T:    H < 12 ? "A"  : "P",
      TT:   H < 12 ? "AM" : "PM",
      Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
      o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    };

  return mask.replace(token, function ($0) {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
  });
}


// ---------------------------------------------------------------------------
/** Returns a tabular 2D array representation of a CSV string using a custom 
 * delimiter.
 * @return {string[][]} 
 */
Utilities.parseCsv = function (data, opt) 
{
  var doc = [];
  var arr = [];
  var value = '';
  var inquote = false;
  opt = Utilities.extends({
      separator: ',',
      quoteSym: '"',

  }, opt);

  for (var i = 0; i < data.length; ++i) {
    if (data[i] == opt.quoteSym && !inquote) {
      inquote = true;
    } else if (data[i] == opt.quoteSym) {
      if (i+1 < data.length && data[i+1] == opt.quoteSym) {
        value += opt.quoteSym;
        ++i;
      } else {
        inquote = false;
      }
    } else if (data[i] == opt.separator && !inquote) {
      arr.push(value);
      value = '';
    } else if (data[i] == '\n' || data[i] == '\r') {
      if (data[i] == '\r' && i+1 < data.length && data[i+1] == '\n') {
        ++i
      }
      if (!inquote) {
        arr.push(value);
        doc.push(arr);
        arr = [];
        value = '';
      } else {
        value += data[i];
      }
    } else {
      if (value == '' && !inquote && data[i] <= ' ')
        continue;
      value += data[i];
    }
  }
  
  if (arr.length > 0 || value != '') {
    arr.push(value);
    doc.push(arr);
  }
  return doc;
}


// ---------------------------------------------------------------------------
/** Compute a digest using SHA-1 on the specified value
 */
Utilities.sha1 = function (blob) 
{

}


// ---------------------------------------------------------------------------
/** Sleeps for specified number of milliseconds.
 */
Utilities.sleep = function (milliseconds) 
{
  throw "Not supported";
}


// ---------------------------------------------------------------------------
/** Takes a Blob representing a zip file and returns its component files. 
 * @return {blob}
 */
Utilities.unzip = function (blob, name)
{

}


// ---------------------------------------------------------------------------
/** Creates a new Blob object that is a zip file containing the data from the 
 * Blobs passed in.
 * @return {blob}
 */
Utilities.zip = function (blob, name)
{

}

