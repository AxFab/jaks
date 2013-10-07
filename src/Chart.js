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
        mark_width:3,
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


    var drawMarkee = function (ctx, rect, grid, abscissa, group)
    {
      ctx.lineWidth = 2;

      for (var idx = 0; idx < grid.data[0].length; ++idx) {
        for (var x = 0; x < grid.data.length; ++x) {
          v = grid.data[x][idx];
          if (v == null || isNaN(v))
            continue;
          var px = rect.x + (abscissa.data[x][0] - abscissa.vwMin) * abscissa.scale;
          var py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
          ctx.fillStyle = grid.colors[idx % grid.colors.length];
          ctx.beginPath ();
          ctx.arc (px, py, grid.mark_width,0,2*Math.PI);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.beginPath ();
          ctx.arc (px, py, grid.mark_width*0.6,0,2*Math.PI);
          ctx.fill();
        }
      }
    }

    var drawAxisGeneric = function(ctx, grid, coords, ox, oy) {

      var pos;
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
                x = pos.x - grid.scale / 2
              } else {
                x = pos.x;
              }
              if (v + grid.vwGap > grid.vwMax) 
                w = (grid.vwMax - v) * grid.scale;
              else 
                w = grid.vwGap * grid.scale;
              ctx.fillRect(x, rect.y, w, rect.h);
              
            } else {
              if (v + grid.vwGap > grid.vwMax) 
                h = (grid.vwMax - v) * grid.scale;
              else 
                h = grid.vwGap * grid.scale;
              ctx.fillRect(rect.x, pos.y, rect.w, -h);
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

      if (coords != null)
        drawZone (ctx, grid, rect, coords, grid.showAxis);
    }

    var updateGrid = function (grid, name, size) 
    {
      max = -99999999999999;
      min = 99999999999999;

      if (jaks.Plotter[grid.plot] == null) {
        err = {
          msg: "Unknown plotter " + grid.plot
        }
        console.error (err.msg)
        throw err;
      }

      if (jaks.Plotter[grid.plot].summedValue || grid.modif == 'percentage') {

        for (var i = 0; i < grid.data.length; ++i) {
          var sum = 0;
          for (var j = 0; j < grid.data[0].length; ++j) {
            value = grid.data[i][j];
            if (value == null || isNaN(value))
              continue;
            sum += value;
          }
          if (sum > max)
            max = sum;
          if (sum < min)
            min = sum;

          if (grid.modif == 'percentage') {
            for (var j = 0; j < grid.data[0].length; ++j) {
              value = grid.data[i][j];
              value *= 100 / sum;
              grid.data[i][j] = value;
            }
          }
        }

        if (grid.modif == 'percentage') {
          max = 100;
          min = 0;
        }

      } else {

        for (var i = 0; i < grid.data.length; ++i) {
          for (var j = 0; j < grid.data[0].length; ++j) {
            value = grid.data[i][j];
            if (value == null || isNaN(value))
              continue;
            if (value > max)
              max = value;
            if (value < min)
              min = value;
          }
        }
      }

      grid.vwMin = (grid.min != null ? grid.min : min);
      grid.vwMax = (grid.max != null ? grid.max : max);
      grid.axStart = grid.vwMin; // Align 
      var gap = (grid.min == null ? grid.pad : 0) + (grid.max == null ? grid.pad : 0) + 1
      grid.scale = size / (grid.vwMax - grid.vwMin) / gap;

      // TODO realy bad design here !
      if (grid == prv.x) {
        if (jaks.Plotter[prv.y1.plot].stepGap == true) {
          grid.vwMax += 1;
          grid.scale = size / (grid.vwMax - grid.vwMin) / gap;
           grid.vwMin -= 0.5;
           grid.vwMax -= 0.5;
        }
      } 
      
      if (grid.min == null)
        grid.vwMin -= (grid.vwMax - grid.vwMin) * grid.pad;
      if (grid.max == null)
        grid.vwMax += (grid.vwMax - grid.vwMin) * grid.pad;
      

      grid.vwGap = Math.round (40 / grid.scale);
      if (grid.vwGap == 0) grid.vwGap = 1;
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

    var updateGroup = function (grid, data) {
      grid.head = []
      grid.data = []
      if (grid.idx) {
        for (var l=0; l<grid.idx.length; ++l) {
          grid.head[l] = getHeader (data, grid.idx[l]);
        }

        for (var i=1; i<data.length; ++i) {
          grid.data[i-1] = [];
          for (var l=0; l<grid.idx.length; ++l) {
            j = grid.idx[l];
            grid.data[i-1][l] = parseFloat(data[i][j]);
          }
        }

      } else {
        for (var j=1; j<data[0].length; ++j) {
          grid.head[j-1] = getHeader (data, j);
        }

        for (var i=1; i<data.length; ++i) {
          grid.data[i-1] = [];
          for (var j=1; j<data[0].length; ++j) {
            grid.data[i-1][j-1] = parseFloat(data[i][j]);
          }
        }
      }
    }

    this.forEachGroup = function (callback) 
    {
      var i = 1;
      while (true) {
        var grid = prv['y'+i]
        if (grid == undefined)
          break;
        callback (grid, 'y'+i);
        ++i;
        if (i > 9) // TODO Fix the limit where to look
          break;
      }
    }

    var getHeader = function (data, idx)
    {
      var head = {
        name: data[0][idx]
      }

      var value = data[1][idx];

      if (!isNaN(new Date(value).getTime ())) {
        head.type = 'date'
        head.parse = function (v) { return new Date(v).getTime(); }

      } else if (!isNaN(parseFloat(value))) {
        head.type = 'float'
        head.parse = parseFloat
      } 

      return head;
    }

    this.update = function (data) 
    {
      prv.x = jaks.extends (prv.x, prv.grid);
      prv.x = jaks.extends (prv.x, options.grid.x);
      prv.x.plot = prv.plot;

      var i = 1;
      while (true) {
        if (options.grid['y'+i] == undefined)
          break;
        prv['y'+i] = {}
        prv['y'+i] = jaks.extends ({}, prv.grid);
        prv['y'+i].plot = prv.plot;
        prv['y'+i].showAxis = 'west'
        prv['y'+i].pad = 0.05;
        prv['y'+i] = jaks.extends (prv['y'+i], options.grid['y'+i]);
        ++i;
        if (i > 9) // TODO Fix the limit where to look
          break;
      }

      /* Data - X */
      prv.x.head = getHeader (data, 0);

      prv.x.data = [];
      for (var i=1; i<data.length; ++i) {
        prv.x.data[i-1] = []
        prv.x.data[i-1][0] = prv.x.head.parse(data[i][0]);
      }

      /* Data - Y */
      this.forEachGroup (function (grid) {
        updateGroup (grid, data)
      })

      /* Update - Y */
      updateGrid (prv.x, 'x', prv.graph.w);
      this.forEachGroup (function (grid, grp) {
        updateGrid (grid, grp, prv.graph.h)
      })

      console.log ('DATA', prv.x.data, prv.x.head, prv.y1.data, prv.y1.head, prv.x.vwMin, prv.x.vwMax)
    }

    this.paint = function () 
    {
      drawAxis (prv.ctx, prv.graph, prv.x);
      drawAxis (prv.ctx, prv.graph, prv.y1);

      prv.ctx.beginPath ()
      prv.ctx.rect (prv.graph.x, prv.graph.y, prv.graph.w, prv.graph.h)
      prv.ctx.clip ()

      this.forEachGroup (function (grid) {
        // jaks.Plotter[prv.y1.plot].draw (prv.ctx, prv.graph, prv.y1, prv.x, prv.data, 'y1');
        jaks.Plotter[grid.plot].draw (prv.ctx, prv.graph, grid, prv.x);
        if (grid.mark != null) {
          drawMarkee (prv.ctx, prv.graph, grid, prv.x);
        }
      });

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

