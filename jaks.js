/*
    Jaks - Graphic Framework for JavaScript

    Copyright (C) 2013  Fabien Bavent<fabien.bavent@gmail.com>

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/
jaks = {};

(function () {

  this.Chart = function (id, data, option) {

    var ctx;
    var padding = {
      right:80,
      left:80,
      top:40,
      bottom:40
    };
    var vw = {};

    var resize = function (width, height) 
    {
      ctx.canvas.width = width;
      ctx.canvas.height = height;

      vw = {
        stY: option.height - padding.bottom,
        scY: 1,
        stX: padding.left,
        scX: 1,
      }
    };

    var drawLine = function () 
    {
      var colors = ['red', 'blue', 'green'];
      if (option.colors)
        colors = option.colors;
      ctx.lineWidth = 3;

      for (var j = 0; j < data.length; ++j) {
        ctx.strokeStyle = colors[j % colors.length];
        ctx.beginPath ();
        ctx.moveTo (vw.stX, vw.stY - data[j][0] * vw.scY);
        for (var i = 0; i < data[j].length; ++i) {
          var px = vw.stX + i * vw.scX;
          var py = vw.stY - data[j][i] * vw.scY;
          ctx.lineTo (px, py);
        }
        ctx.stroke();
      }
    }

    var drawGrid = function () {

      ctx.font="20px Arial";
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, option.height - padding.bottom + 5);
      ctx.stroke ();

      ctx.moveTo(padding.left - 5, option.height - padding.bottom);
      ctx.lineTo(option.width - padding.right, option.height - padding.bottom);
      ctx.stroke ();

      for (var i = 0; i < data[0].length; i += gapX) {
        ctx.moveTo (padding.left + i * vw.scX, option.height - padding.bottom);
        ctx.lineTo (padding.left + i * vw.scX, option.height - padding.bottom + 2);
        ctx.stroke ();

        var w = ctx.measureText (i).width;
        ctx.fillText(i, padding.left + i * vw.scX - w/2, option.height - padding.bottom + 25);
      }

      for (var i = 0; i < max; i += gapY) {
        ctx.moveTo (padding.left, option.height - padding.bottom - i * vw.scY);
        ctx.lineTo (padding.left - 2, option.height - padding.bottom - i * vw.scY);
        ctx.stroke ();

        var w = ctx.measureText (i).width;
        ctx.fillText(i, padding.left - w - 10, option.height - padding.bottom - i * vw.scY + 5);
      }
    }

    var max;
    var gapX = 1;
    var gapY = 3;
    var update = function () 
    {
      max = -99999999;
      min = 99999999;
      for (var j = 0; j < data.length; ++j) {
        for (var i = 0; i < data[j].length; ++i) {
          if (data[j][i] > max)
            max = data[j][i];
          if (data[j][i] < min)
            min = data[j][i];
        }
      }

      vw.scY = (option.height - padding.top - padding.bottom) / max / 1.2;
      gapY =  parseInt (60 / vw.scY) + 1;

      vw.scX = (option.width - padding.right - padding.left) / (data[0].length-1);
      gapX =  parseInt (60 / vw.scX) + 1;
    }

    {
      cvs = document.getElementById(id);
      ctx = cvs.getContext('2d');
      if (!option.width) option.width = 600;
      if (!option.height) option.height = 400;
      resize (option.width, option.height);

      update ();
      drawGrid ();
      drawLine ();
    }
  };

}).apply (jaks);

