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

  /**
   * Create an instance of the Chart class. A chart is a generic graphical 
   * representation of a data table. Charts need plotters to actualy represent
   * data.
   * @constructor
   * @param {string} id - Id that represent the container of the graph.
   * @param {string|array} data - Table of data to feed the graph or csv file.
   * @param {object} options - Options for the creation of this graph.
   */
  this.Chart = function (id, data, options) {

    jaks.EventDispatcher.apply(this); // Inherit form EventDispatcher

    var prv = jaks.extends({
      width:600,
      height:300,
      ctx: null,
      plot:'ClusteredLine',
      padding: {
        right:80,
        left:80,
        top:40,
        bottom:40
      },
      grid: {
        axisColor:'black',
        axisWidth:0.5,
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
        colors:['#a61010', '#1010a6', '#10a610', '#a610a6', '#a6a610', '#10a6a6'],
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
      var prev = NaN;

      for (var serie = 0; serie < grid.data.length; ++serie) {
        ctx.strokeStyle = grid.colors[serie % grid.colors.length];
        ctx.beginPath ();
        var v = grid.data[serie][0];
        var px = rect.x;
        var py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
        for (var x = 0; x < grid.data[serie].length; ++x) {
          v = grid.data[serie][x];
          if (v == null)
            continue;
          if (isNaN(v)) {
            ctx.stroke();
            prev = NaN;
          }
          px = rect.x + abscissa.data[0][x] * abscissa.scale;
          py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
          if (isNaN(prev))
           ctx.moveTo (px, py);
          else
            ctx.lineTo (px, py);
          prev = v;
        }
        ctx.stroke();
      }
    }

    var drawMarkee = function (ctx, rect, grid, abscissa)
    {
      ctx.lineWidth = 1;
      ctx.fillStyle = 'white';

      for (var serie = 0; serie < grid.data.length; ++serie) {
        ctx.strokeStyle = grid.colors[serie % grid.colors.length];
        for (var x = 0; x < grid.data[serie].length; ++x) {
          var v = grid.data[serie][x];
          if (v == null || isNaN(v))
            continue;
          var px = rect.x + abscissa.data[0][x] * abscissa.scale;
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
      console.log(grid);
      ctx.font= parseInt(grid.fontSize) + 'px ' + grid.fontFamily;
      ctx.strokeStyle = grid.gridColor;
      ctx.fillStyle = grid.axisColor;
      ctx.lineWidth = grid.gridWidth;

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

      ctx.strokeStyle = grid.axisColor;
      ctx.lineWidth = grid.axisWidth;

      ctx.beginPath();
      pos = coords (grid.vwMin)
      ctx.moveTo(pos.x, pos.y);
      pos = coords (grid.vwMax)
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke ();

    }

    var drawZone = function (ctx, grid, rect, coords, ori) {

      if (grid.background == 'full') {
        ctx.fillStyle = grid.bgColor;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

      } else if (grid.background != null) {
        ctx.fillStyle = grid.bgColor;
        for (var v = grid.axStart, k = 1;
            v <= grid.vwMax;
            v += grid.vwGap, ++k) {
          if (grid.background == 'even' && (k & 1) == 0 || 
              grid.background == 'odd' && (k & 1) == 1) {

            pos = coords (v, 0)

            if (ori == 'south' || ori == 'north') {
              if (jaks.Plotter[grid.plot].stepGap == true) {
                ctx.fillRect(pos.x - grid.vwGap / 2, rect.y, grid.vwGap * grid.scale, rect.h);
              } else {
                ctx.fillRect(pos.x, rect.y, grid.vwGap * grid.scale, rect.h);
              }
            } else {
              ctx.fillRect(rect.y, pos.x, rect.w, grid.vwGap * grid.scale);
            }
          }
        }
      }

      if (grid.zone == null)
        return; 

      for (var i=0; i<grid.zone; i++) {
        var zone = grid.zone[i];

        if (zone.value == null) {
          pMin = coords (zone.min, 0)
          pMax = coords (zone.max, 0)
          ctx.fillStyle = zone.bgColor;

          if (ori == 'south' || ori == 'north') 
            ctx.fillRect(pMin.x, rect.y, pMax.x - pMin.x, rect.h);
          else
            ctx.fillRect(rect.x, pMin.y, rect.w, pMax.y - pMin.y);
        } else {
          pVal = coords (zone.value, 0)
          ctx.strokeStyle = zone.bgColor;
          ctx.lineWidth = zone.width;

          if (ori == 'south' || ori == 'north') {
            ctx.moveTo(pVal.x, rect.y);
            ctx.lineTo(pVal.x, rect.y + rect.h);
          } else {
            ctx.moveTo(rect.x, pVal.y);
            ctx.lineTo(rect.x + rect.w, pVal.y);
          }
        }
      }
    }

    var drawAxis = function (ctx, rect, grid) {

      if (grid.showAxis == 'south') {

        var coords = function (value, width) {
          var pos = { 
            x:rect.x + (value - grid.vwMin) * grid.scale,
            y:rect.h + rect.y,
            sx:0,
            sy:rect.h + rect.y + grid.fontSize + 5,
          };
          pos.sx = pos.x - width / 2;
          return pos;
        };

        drawAxisGeneric (ctx, grid, coords, null, rect.y);

      } else if (grid.showAxis == 'north') {

        var coords = function (value, width) {
          var pos = { 
            x:rect.x + (value - grid.vwMin) * grid.scale,
            y:rect.y,
            sx:0,
            sy:rect.y - 5,
          };
          pos.sx = pos.x - width / 2;
          return pos;
        };

        drawAxisGeneric (ctx, grid, coords, null, rect.y + rect.h);

      } else if (grid.showAxis == 'west') {

        var coords = function (value, width) {
          var pos = { 
            x:rect.x,
            y:rect.h + rect.y - (value - grid.vwMin) * grid.scale,
            sx:rect.x - width - 5,
            sy:0,
          };
          pos.sy = pos.y + 5;
          return pos;
        };

        drawAxisGeneric (ctx, grid, coords, rect.x + rect.w, null);

      } else if (grid.showAxis == 'east') {

        var coords = function (value, width) {
          var pos = { 
            x:rect.x + rect.w,
            y:rect.h + rect.y - (value - grid.vwMin) * grid.scale,
            sx:rect.x + rect.w + 5,
            sy:0,
          };
          pos.sy = pos.y + 5;
          return pos;
        };

        drawAxisGeneric (ctx, grid, coords, rect.x, null);

      }

      drawZone (ctx, grid, rect, coords, grid.showAxis);
    }

    var updateGrid = function (grid, size) 
    {
      max = -9999999999;
      min = 9999999999;
      for (var j = 0; j < grid.data.length; ++j) {
        for (var i = 0; i < grid.data[j].length; ++i) {
          if (grid.data[j][i] == null || isNaN(grid.data[j][i]))
            continue;
          if (grid.data[j][i] > max)
            max = grid.data[j][i];
          if (grid.data[j][i] < min)
            min = grid.data[j][i];
        }
      }

      grid.vwMin = (grid.min != null ? grid.min : min);
      grid.vwMax = (grid.max != null ? grid.max : max);
      grid.axStart = grid.vwMin; // Align 
      grid.scale = size / (grid.vwMax - grid.vwMin) / (1 + 2 * grid.pad);
      if (grid.min == null)
        grid.vwMin -= (grid.vwMax - grid.vwMin) * grid.pad;
      if (grid.max == null)
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

    this.update = function (data) 
    {
      prv.x = jaks.extends (prv.x, prv.grid);
      prv.x = jaks.extends (prv.x, options.x);
      prv.x.plot = prv.plot;
      prv.x.data = [data[0]];

      prv.y = jaks.extends (prv.y, prv.grid);
      prv.y.plot = prv.plot;
      prv.y.showAxis = 'west'
      prv.y.pad = 0.1;
      prv.y = jaks.extends (prv.y, options.y);
      prv.y.data = [];
      for (var i=1; i<data.length; ++i)
        prv.y.data.push(data[i]);

      updateGrid (prv.x, prv.graph.w);
      updateGrid (prv.y, prv.graph.h);
    }

    this.paint = function () 
    {
      drawAxis (prv.ctx, prv.graph, prv.x);
      drawAxis (prv.ctx, prv.graph, prv.y);

      jaks.Plotter[prv.plot].draw (prv.ctx, prv.graph, prv.y, prv.x);
      drawMarkee (prv.ctx, prv.graph, prv.y, prv.x);
      this.trigger ('paint');
    }

    var that = this;
    {
      prv.$cvs = document.getElementById(id);
      prv.ctx = prv.$cvs.getContext('2d');

      prv.grid.color = jaks.getStyle (prv.$cvs, 'color');
      prv.grid.fontFamily = jaks.getStyle (prv.$cvs, 'font-family');
      prv.grid.fontSize = parseInt (jaks.getStyle (prv.$cvs, 'font-size').replace('px', ''));

      jaks.GetCSV(data, function (data) {
        that.resize (prv.width, prv.height);
        that.update (data);
        that.paint ();
      }, options.cvs);
    }
  };

}).apply (jaks);

