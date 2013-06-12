/*

    Jaks - Graphic Framework for JavaScript

    Copyright (C) 2013  Fabien Bavent<fabien.bavent@gmail.com>

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Jaks.  If not, see <http://www.gnu.org/licenses/>.
*/
(function () {

  this.GetCSV = function (data, callback, options) {

      if (Object.prototype.toString.call( data ) === '[object Array]') {
        for(var i=0; i<data.length; ++i) {
          if (Object.prototype.toString.call( data[i] ) !== '[object Array]') {
            return; // Bad format
          }
        }
        if (callback)
          callback(data)
      } else if (typeof (data) === 'string') {
        if (data.indexOf(',') >=0) {
          data = jaks.ParserCSV(data, options)
            if (!data)
              return; // Bad format
          if (callback)
            callback(data)
        } else {
          jaks.GET (data, function (content) {
            data = jaks.ParserCSV(content, options)
            if (!data)
              return; // Bad format
            if (callback)
              callback(data)
          })
        }
      } 
      return; // Unknown format
  }

  this.ParserCSV = function (csv, options) {
    var opt = jaks.extends({
      separator: ',',
      quoteSym: '"',
      newValue:null,
      newLine:null
    }, options);

    var doc = [];
    var arr = [];
    var value = '';
    var inquote = false;
    for (var i = 0; i < csv.length; ++i) {
      if (csv[i] == opt.quoteSym && !inquote) {
        inquote = true;
      } else if (csv[i] == opt.quoteSym) {
        if (i+1 < csv.length && csv[i+1] == opt.quoteSym) {
          value += opt.quoteSym;
          ++i;
        } else {
          inquote = false;
        }
      } else if (csv[i] == opt.separator && !inquote) {
        if (opt.newValue) opt.newValue(value);
        arr.push(value);
        value = '';
      } else if (csv[i] == '\n' || csv[i] == '\r') {
        if (csv[i] == '\r' && i+1 < csv.length && csv[i+1] == '\n') {
          ++i
        }
        if (!inquote) {
          arr.push(value);
          doc.push(arr);
          if (opt.newValue) opt.newValue(value);
          if (opt.newLine) opt.newLine(arr);
          arr = [];
          value = '';
        } else {
          value += csv[i];
        }
      } else {
        if (value == '' && !inquote && csv[i] <= ' ')
          continue;
        value += csv[i];
      }
    }
    
    if (arr.length > 0 || value != '') {
      arr.push(value);
      doc.push(arr);
      if (opt.newValue) opt.newValue(value);
      if (opt.newLine) opt.newLine(arr);
    }
    return doc;
  };

}).apply (jaks);
