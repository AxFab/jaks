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
(function() {

  this.extends = function(destination, source) {
    if (source) {
      if (!destination)
        destination = {}
      for (var property in source) {
        destination[property] = source[property];
      }
    }
    return destination;
  };

  this.shakerSort = function(list, comp_func, desc) {
    var b = 0;
    var t = list.length - 1;
    var swap = true;

    while(swap) {
      swap = false;
      for(var i = b; i < t; ++i) {
        var c = comp_func(list[i], list[i+1]);
        if (!desc) c = -c;
        if ( c > 0 ) {
          var q = list[i]; list[i] = list[i+1]; list[i+1] = q;
          swap = true;
        }
      } 
      t--;

      if (!swap) break;

      for(var i = t; i > b; --i) {
        var c = comp_func(list[i], list[i-1]);
        if (!desc) c = -c;
        if ( c < 0 ) {
          var q = list[i]; list[i] = list[i-1]; list[i-1] = q;
          swap = true;
        }
      } 
      b++;

    }
  }

}).apply (jaks);
