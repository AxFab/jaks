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

  this.Wiki = function (container, opt) 
  {
    var prv = jaks.extends({
      dir:'/papers',
      ext:'.md',
      home:'home',
      err:'err',
    }, opt);

    var getUrlOfWiki = function () 
    {
      var anchor = document.URL
      k = anchor.lastIndexOf('#')
      anchor = (k >=0) ? anchor.substring(k+1) : prv.home;

      var k = anchor.indexOf(':')
      var page = (k >=0)  ? anchor.substring (k+1) : anchor;
      var namespace = anchor.substring (0, k) 

      var url = prv.dir + '/' + namespace + '/' + page + prv.ext
      return url;
    }

    this.reset = function (url) 
    {
      if (url == null)
        url = getUrlOfWiki();

      jaks.GET (url, function (data) {

        var pager = document.getElementById(container);
        pager.innerHTML = jaks.Markdown (data);
        
        /* jaks.select (container + ' .wiki-intern').onclick (function () {
          that.reset();
        }); */
      });
    }

    var that = this;
    {
      this.reset ();
    }
  }

}).apply (jaks);
