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

  this.sortChild = function (item, compare, desc) {
    var arr = []
    $(item).children().each(function() {
      arr.push(this);
    }); 
    
    jaks.shakerSort(arr, compare, !desc);
    $(item).html(arr);
  }

  var colNo = 9;
  var sortNum = function(a, b) {
    aa = parseFloat(a.children[colNo].textContent);
    bb = parseFloat(b.children[colNo].textContent);
    if (isNaN(aa) && isNaN(bb)) throw aa
    if (isNaN(aa)) return -1
    if (isNaN(bb)) return 1
    return aa-bb;
  }
  
  var sortAlpha = function(a, b) {
    aa = a.children[colNo].textContent;
    bb = b.children[colNo].textContent;
    if (aa == bb) return 0;
    if (aa < bb) return -1;
    return 1;
  }
  
  var sortAll = function(a, b) {
    try {
      return sortNum (a,b);
    } catch (e) {
      return sortAlpha (a,b);
    }
  }
  
  this.tableSort = function (item) {
    headers = $('thead > tr > th', $(item));
    headers.click(function (e) {
      colNo = this.cellIndex;
      var ss = $(this).data('sortState');
      $(headers).each(function() {
        $('i:last-child', this).remove();
      }); 
        
      var compare = $(this).data('sorter');
      if (compare == null) {
        compare = sortAll;
        $(this).data('sorter', compare);
      }
       
      var tbody = $('tbody', $(item));
      if (ss == 'up') {
        jaks.sortChild(tbody, compare, true);
        $(this).data('sortState', 'down');
        $(this).append('<i class="icon-chevron-down icon-white pull-right" style="margin:3px"></i>');
      } else {
        jaks.sortChild(tbody, compare, false);
        $(this).data('sortState', 'up');
        $(this).append('<i class="icon-chevron-up icon-white pull-right" style="margin:3px"></i>');
      }
    })
  }

}).apply (jaks);
