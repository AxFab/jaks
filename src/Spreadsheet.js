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

  this.Spreadsheet = function (data, callback, options) {

    var prv = jaks.extends({
      headRows:1,
      headCols:1,
    }, options);

    var htmlLine = function (arr)
    {
      var html = '<tr>';
      for (var i=0; i<arr.length; ++i) {
        if (i < prv.headCols) 
          html += '<th>' + arr[i] +'</th>';
        else
          html += '<td>' + arr[i] +'</td>';
      }
      return html + '</tr>';
    }

    this.html = function (css)
    {
      if (typeof css !== 'string')
        css = ''
      var html = '<table class="' + css + '">';
      html += (prv.headRows > 0 ? '<thead>' : '<tbody>');
      for (var i=0; i<prv.data.length; ++i) {
        if (i == prv.headRows && prv.headRows > 0)
          html += '</thead><tbody>';
        html += htmlLine(prv.data[i]);
      }
      return html + '</tbody></table>';
    }

    var that = this;
    {
      jaks.GetCSV (data, function (array) {
        prv.data = array;
        if (callback)
          callback (that)
      })
    }
  };

}).apply (jaks);

