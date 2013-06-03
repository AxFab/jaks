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
jaks = {};

(function() {

  this.extends = function(destination, source) {
    if (!destination)
      destination = {}
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  };
}).apply (jaks);


(function () {

  this.Chart = function (id, data, options) {

    var prv = jaks.extends({
      width:600,
      height:300,
      ctx: null,
      padding: {
        right:80,
        left:80,
        top:40,
        bottom:40
      },
      grid: {
        axisColor:'black',
        axisWidth:0.3,
        gridColor:'black',
        gridWidth:0.3,
        fontSize:20,
        fontFamily:'Arial',
        showAxis:'south',
        vwMin:0,
        vwMax:0,
        vwGap:0,
        vwSize:0,
        pad:0,
        width:3,
        colors:['red', 'blue', 'green'],
        drawGrid:true
      },
      graph:{
        x:0,
        y:0,
        w:0,
        h:0
      }
    }, options); 

    var drawLine = function (ctx, rect, grid, abscissa)
    {
      ctx.lineWidth = grid.width;

      for (var serie = 0; serie < data.length; ++serie) {
        ctx.strokeStyle = grid.colors[serie % grid.colors.length];
        ctx.beginPath ();
        var v = grid.data[serie][0];
        var px = rect.x;
        var py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
        ctx.moveTo (px, py);
        for (var x = 1; x < data[serie].length; ++x) {
          v = grid.data[serie][x];
          px = rect.x + x * abscissa.scale;
          py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
          ctx.lineTo (px, py);
        }
        ctx.stroke();
      }
    }

    var drawMarkee = function (ctx, rect, grid, abscissa)
    {
      ctx.lineWidth = 1;
      ctx.fillStyle = 'white';

      for (var serie = 0; serie < data.length; ++serie) {
        ctx.strokeStyle = grid.colors[serie % grid.colors.length];
        for (var x = 0; x < data[serie].length; ++x) {
          var v = grid.data[serie][x];
          var px = rect.x + x * abscissa.scale;
          var py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
          ctx.beginPath ();
          ctx.arc (px, py, 3 ,0,2*Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    var drawAxisGeneric = function(ctx, grid, coords, ox, oy) {

        var pos;
        ctx.beginPath();

        pos = coords (grid.vwMin)
        ctx.moveTo(pos.x, pos.y);
        pos = coords (grid.vwMax)
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke ();

        for (var v = grid.axStart, k = 1;
            v <= grid.vwMax;
            v += grid.vwGap, ++k) {

          var tx = v;
          var w = ctx.measureText (tx).width;
          pos = coords (v, w)

          if (grid.drawGrid == true) {
            ctx.beginPath();
            ctx.moveTo(ox ? ox : pos.x, oy ? oy : pos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke ();
          }

          ctx.fillText(tx, pos.sx, pos.sy);
        }
    }

    var drawAxis = function (ctx, rect, grid) {

      ctx.font= parseInt(grid.fontSize) + 'px ' + grid.fontFamily;
      ctx.strokeStyle = grid.axisColor;
      ctx.lineWidth = grid.axisWidth;

      if (grid.showAxis == 'south') {

        drawAxisGeneric (ctx, grid, function (value, width) {
          var pos = { 
            x:rect.x + (value - grid.vwMin) * grid.scale,
            y:rect.h + rect.y,
            sx:0,
            sy:rect.h + rect.y + grid.fontSize + 5,
          };
          pos.sx = pos.x - width / 2;
          return pos;
        }, null, rect.y);

      } else if (grid.showAxis == 'north') {

        drawAxisGeneric (ctx, grid, function (value, width) {
          var pos = { 
            x:rect.x + (value - grid.vwMin) * grid.scale,
            y:rect.y,
            sx:0,
            sy:rect.y - 5,
          };
          pos.sx = pos.x - width / 2;
          return pos;
        }, null, rect.y + rect.h);

      } else if (grid.showAxis == 'west') {

        drawAxisGeneric (ctx, grid, function (value, width) {
          var pos = { 
            x:rect.x,
            y:rect.h + rect.y - (value - grid.vwMin) * grid.scale,
            sx:rect.x - width - 5,
            sy:0,
          };
          pos.sy = pos.y + 5;
          return pos;
        }, rect.x + rect.w, null);

      } else if (grid.showAxis == 'east') {

        drawAxisGeneric (ctx, grid, function (value, width) {
          var pos = { 
            x:rect.x + rect.w,
            y:rect.h + rect.y - (value - grid.vwMin) * grid.scale,
            sx:rect.x + rect.w + 5,
            sy:0,
          };
          pos.sy = pos.y + 5;
          return pos;
        }, rect.x, null);
      }
    }

    var updateGrid = function (grid, size) 
    {
      max = -9999999999;
      min = 9999999999;
      for (var j = 0; j < grid.data.length; ++j) {
        for (var i = 0; i < grid.data[j].length; ++i) {
          if (grid.data[j][i] > max)
            max = grid.data[j][i];
          if (grid.data[j][i] < min)
            min = grid.data[j][i];
        }
      }

      grid.vwMin = (grid.min ? grid.min : min);
      grid.vwMax = (grid.max ? grid.max : max);
      grid.axStart = grid.vwMin; // Align 
      grid.scale = size / (grid.vwMax - grid.vwMin) / (1 + 2 * grid.pad);
      grid.vwMin -= (grid.vwMax - grid.vwMin) * grid.pad;
      grid.vwMax += (grid.vwMax - grid.vwMin) * grid.pad;
      grid.vwGap = Math.round (60 / grid.scale);
    }
    
    this.resize = function (width, height) 
    {
      prv.width = width;
      prv.height = height;
      prv.ctx.canvas.width = width;
      prv.ctx.canvas.height = height;

      prv.graph = {
        x: prv.padding.left,
        y: prv.padding.top,
        w: prv.width - prv.padding.left - prv.padding.right,
        h: prv.height - prv.padding.top - prv.padding.bottom,
      };
    };


    {
      cvs = document.getElementById(id);
      prv.ctx = cvs.getContext('2d');
      this.resize (prv.width, prv.height);

      prv.x = jaks.extends (prv.x, prv.grid);
      prv.x.showAxis = 'south'
      prv.y = jaks.extends (prv.y, options.x);

      prv.x.data = [[0]];
      for (var i=0; i<data[0].length; ++i)
        prv.x.data[0][i] = i;

      updateGrid (prv.x, prv.graph.w);
      drawAxis (prv.ctx, prv.graph, prv.x);



      prv.y = jaks.extends (prv.y, prv.grid);
      prv.y.showAxis = 'west'
      prv.y = jaks.extends (prv.y, options.y);

      prv.y.data = data;
      prv.y.pad = 0.1;

      updateGrid (prv.y, prv.graph.h);
      drawAxis (prv.ctx, prv.graph, prv.y);

      drawLine (prv.ctx, prv.graph, prv.y, prv.x);
      drawMarkee (prv.ctx, prv.graph, prv.y, prv.x);

      console.log (this, prv);
    }
  };

}).apply (jaks);

