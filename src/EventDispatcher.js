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

  this.EventDispatcher = function() {

    // Private field
    var prv = {
      callbacks: {}
    };
    
    // Public methods
    this.on = function (name, func) {
      if (prv.callbacks[name] == null)
        prv.callbacks[name] = [];
      prv.callbacks[name].push (func);
    }
      
    this.clearEvent = function (name) {
      prv.callbacks[name] = undefined;
    }

    this.clearAll = function (name) {
      prv.callbacks = {};
    }
    
    this.trigger = function (name, event) {
      if (event == null)
        event = {};
      event.name = name;
      event.sender = that;
      var arr = prv.callbacks[name]
      if (arr != null) {
        for (var i=0; i < arr.length; ++i) {
          if (arr[i] != null)
            arr[i](event);
        }
      }
    }
    
    // Constructor
    var that = this;
    {
    }
  };

}).apply (jaks);
