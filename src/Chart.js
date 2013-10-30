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
      titleLayout:'',
      legendLayout:'east',
      padding: {
        right:10,
        left:10,
        top:10,
        bottom:10
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
        gridSize:40,
        drawGrid:true,
      },
      graph:{
        x:0,
        y:0,
        w:0,
        h:0
      },
      select:{
        grp: 0,
        ser: 0,
        abs: 0
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

    var drawAxisGeneric = function(ctx, grid, coords, ox, oy)
    {
      var pos;
      ctx.font= parseInt(grid.fontSize) + 'px ' + grid.fontFamily;
      ctx.strokeStyle = grid.gridColor;
      ctx.fillStyle = grid.axisColor;
      ctx.lineWidth = grid.gridWidth;

      for (var v = grid.axStart, k = 1;
          v <= grid.vwMax;
          v += grid.vwGap, ++k) {

        var tx = v.toFixed(grid.log);
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

    var drawZone = function (ctx, grid, rect, coords, ori) 
    {
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

    var drawAxis = function (ctx, rect, grid)
    {
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
      

      grid.log = Math.log (grid.vwMin) / Math.log (10)
      // console.log (log, isNaN(log))
      if (isFinite(grid.log)) {
        grid.axStart = parseFloat (grid.vwMin.toFixed(grid.log))

      } else {
        grid.log = 0
        grid.axStart = parseFloat (grid.vwMin.toFixed(grid.log))
        // grid.axStart = grid.vwMin
      }
      /*
      console.log (grid.vwMin/grid.vwMax, Math.log(grid.vwMin/grid.vwMax)/Math.log(10))
      grid.log = (Math.log(grid.vwMin/grid.vwMax)/Math.log(10) + 1)
      grid.

*/
      grid.vwGap = Math.round (grid.gridSize / grid.scale);
      if (grid.vwGap == 0) grid.vwGap = 1;
      // grid.axStart = grid.vwMin; // Align 

    }
    
    this.resize = function (width, height) 
    {
      prv.width = width;
      prv.height = height;
      prv.ctx.canvas.width = width;
      prv.ctx.canvas.height = height;
    }

    this.refreshlayout = function ()
    {
      width = prv.ctx.canvas.width;
      height = prv.ctx.canvas.height;

      prv.graph = {
        x: 0,
        y: 0,
        w: width - 0,
        h: height - 0,
      };

      // AXIS X
      if (prv.x.showAxis != 'none') 
        prv.graph.h -= 30;

      // AXIS Y
      if (prv.severalAxis) {
        this.forEachGroup (function (grid) {
          if (grid.showAxis != 'none') {
            prv.graph.x += 60;
            prv.graph.w -= 60;
          }
        })
      } else if (prv.y1.showAxis != 'none') {
        prv.graph.x += 60;
        prv.graph.w -= 60;
      }

      switch (prv.titleLayout) {
        case 'north': 
          prv.graph.y += prv.grid.fontSize * 2.8;
          prv.graph.h -= prv.grid.fontSize * 2.8;
          prv.titleInfo = {
            x:prv.graph.x,
            w:prv.graph.w,
            y:prv.grid.fontSize * 1.8
          }
          break;

        case 'south':
          prv.graph.h -= prv.grid.fontSize * 2.8;
          prv.titleInfo = {
            x:prv.graph.x,
            w:prv.graph.w,
            y:height - prv.grid.fontSize * 1.8
          }
          break;
      }

      var series = 0
      this.forEachGroup (function (grid) {
        series += grid.head.length;
      })

      switch (prv.legendLayout) {
        case 'north': 
          prv.legend = {
            x:prv.graph.x,
            w:prv.graph.w,
            y:prv.graph.y,
            h:40 /* Compute */,
            s:series
          }
          prv.graph.y += prv.legend.h
          prv.graph.h -= prv.legend.h
          prv.legend.o = true;
          break;

        case 'south':
          prv.legend = {
            x:prv.graph.x,
            w:prv.graph.w,
            y:prv.graph.h-40,
            h:40 /* Compute */,
            s:series
          }
          prv.graph.h -= prv.legend.h
          prv.legend.o = true;
          break;

        case 'west':
          prv.legend = {
            x:prv.graph.x,
            w:100,
            y:10,
            h:height-20,
            s:series
          }
          prv.graph.x += prv.legend.w + 20
          prv.graph.w -= prv.legend.w + 20
          prv.legend.o = false;
          break;

        case 'east':
          lg = parseInt ((height - 20) / 25)
          lgc = Math.ceil(series/lg);
          prv.legend = {
            x:prv.graph.x + prv.graph.w - 110 * lgc,
            w:110 * lgc,
            y:10,
            h:height-20,
            s:series,
            sc:lg
          }
          prv.graph.w -= prv.legend.w + 10
          prv.legend.o = false;
          break;
      }

      if (prv.graph.x < prv.padding.left) {
        prv.graph.w -= prv.padding.left - prv.graph.x
        prv.graph.x += prv.padding.left - prv.graph.x
      }
      if (prv.graph.y < prv.padding.top) {
        prv.graph.h -= prv.padding.top - prv.graph.y
        prv.graph.y += prv.padding.top - prv.graph.y
      }
      if (width - prv.graph.x - prv.graph.w < prv.padding.right) {
        prv.graph.w-= prv.padding.right - (width - prv.graph.x - prv.graph.w)
      }/*
      if (width - prv.graph.w < prv.padding.right) {
        prv.graph.w -= prv.padding.right - width + prv.graph.w
      }*/
      if (height - prv.graph.y - prv.graph.h < prv.padding.bottom) {
        prv.graph.h -= prv.padding.bottom - (height - prv.graph.y - prv.graph.h)
      }
    };

    var updateGroup = function (grid, data) 
    {
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

      that.refreshlayout ();

      /* Update - Y */
      updateGrid (prv.x, 'x', prv.graph.w);
      this.forEachGroup (function (grid, grp) {
        updateGrid (grid, grp, prv.graph.h)
      })

      // console.log ('DATA', prv.x.data, prv.x.head, prv.y1.data, prv.y1.head, prv.x.vwMin, prv.x.vwMax)
    }

    var drawTitle = function  (ctx, prv) 
    {
      if (prv.titleInfo != null) {
        ctx.font= parseInt(prv.grid.fontSize * 1.8) + 'px ' + prv.grid.fontFamily;
        ctx.fillText (prv.title, prv.titleInfo.x, prv.titleInfo.y);
      }
    }

    var drawLegend = function (ctx, prv) 
    {
      if (prv.legend == null) 
        return

      x = prv.legend.x
      y = prv.legend.y + prv.grid.fontSize

      /* TODO Style */ 
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = prv.grid.color;
      ctx.strokeStyle = prv.grid.color;
      ctx.font= parseInt(prv.grid.fontSize) + 'px ' + prv.grid.fontFamily;
      ctx.fillText ('Legend:', x, y);

      that.forEachGroup (function (grid) {

        ctx.font= parseInt(grid.fontSize) + 'px ' + grid.fontFamily;

        for (var i=0; i < grid.head.length; ++i) {

          if (prv.legend.o) {
            x += 110; 
            if (x > prv.legend.x + prv.legend.w) {
              y += 25
              x = prv.legend.x
            }
          } else {
            y+=25;
            if (y > prv.legend.y + prv.legend.h) {
              x += 110; 
              y = prv.legend.y + prv.grid.fontSize + 25
            }
          }

          ctx.fillStyle = grid.colors[i % grid.colors.length];
          ctx.strokeStyle = grid.colors[i % grid.colors.length];
          if (grid.selectedSerie == i)
            ctx.fillRect (
              x + prv.grid.fontSize * 0.1,
              y - prv.grid.fontSize * 0.8, 
              prv.grid.fontSize * 0.8, 
              prv.grid.fontSize * 0.8);
          else
            ctx.fillRect (
              x + prv.grid.fontSize * 0.2, 
              y - prv.grid.fontSize * 0.7, 
              prv.grid.fontSize * 0.6, 
              prv.grid.fontSize * 0.6);

          if (grid.head[i].name.length <= 10) {
            w = ctx.measureText(grid.head[i].name).width
            ctx.fillText (grid.head[i].name, x + 20, y);
          }
          else {
            w = ctx.measureText(grid.head[i].name.substring(0, 8) + '...').width
            ctx.fillText (grid.head[i].name.substring(0, 8) + '...', x + 20, y);
          }

          if (grid.selectedSerie == i) {
            ctx.globalAlpha = 1.0;
            ctx.lineWidth = 2.0;
            ctx.beginPath()
            ctx.moveTo (x + 20, y + 2)
            ctx.lineTo (x + 20 + w, y + 2)
            ctx.stroke();
          }
        }
      });
    }

    var selectGrid = function (mouse) {

      x = mouse.x - prv.graph.x
      y = mouse.y - prv.graph.y

      vx = x / prv.x.scale + prv.x.vwMin;
      vy = (prv.graph.h - y) / prv.y1.scale + prv.y1.vwMin

      var idx = -1, dist = 99999999999;
      for (var i = 0; i < prv.x.data.length; i++) {
        d = Math.abs(vx - prv.x.data[i][0]);
        if (d < dist) {
          idx = i;
          dist = d
        }

      }

      if (false) {
        var jdx = -1, dist = 99999999999;
        for (var j=0; j< prv.y1.data[idx].length; ++j) {
          d = Math.abs(vy - prv.y1.data[idx][j]);
          if (d < dist) {
            jdx = j;
            dist = d
          }
        }
      } else {
        var jdx = -1, dist = 99999999999;
        var sum = 0; 
        for (var j=0; j< prv.y1.data[idx].length; ++j) {
          sum += prv.y1.data[idx][j]
          if (jdx < 0 && sum > vy) {
            jdx = j;
          }
        }
      }

      return { grp: 1, ser:jdx, abs:idx }
    }

    var selectLegend = function (mouse) {

      sgrid = null;
      x = parseInt ((mouse.x - prv.legend.x) / 110)
      y = parseInt ((mouse.y - prv.legend.y) / 25) - 1;

      if (x < 0 || y < 0)
        return { };

      var v = (prv.legend.o) 
        ? y * prv.legend.sc + x 
        : x * prv.legend.sc + y;
      var grp = 1, ser = 0;
      that.forEachGroup (function (grid) {
        if (v < 0)
          return;
        if (v > grid.head.length-1) {
          v -= grid.head.length;
          grp++;
        } else {
          sgrid = grid;
          ser = v;
          v = -1;
        }
      })

      if (sgrid != null)
        return { grp:grp, ser:ser }
      return { };
    }

    this.mouseMotion = function (mouse)
    {
      var origin = prv.select, 
        actual = {
          grp: 0,
          ser: 0,
          abs: 0,
        };

      var o = mouse.x > prv.graph.x && mouse.x < prv.graph.x + prv.graph.w &&
        mouse.y > prv.graph.y && mouse.y < prv.graph.y + prv.graph.h;

      if (prv.legend) {
        var l = mouse.x > prv.legend.x && mouse.x < prv.legend.x + prv.legend.w &&
          mouse.y > prv.legend.y && mouse.y < prv.legend.y + prv.legend.h;
      }

      if (o) {  
        actual = jaks.extends(actual, selectGrid (mouse))

      } else if (l) {
        actual = jaks.extends(actual, selectLegend (mouse))

      } else {
      }

      if (origin.grp != actual.grp || origin.ser != actual.ser || origin.abs != actual.abs) 
      {
        prv.select = actual;
        if (origin.grp != 0)
          prv['y' + origin.grp].selectedSerie = undefined
        if (actual.grp != 0)
          prv['y' + actual.grp].selectedSerie = actual.ser

        this.paint ()
      }
    }

    this.paint = function () 
    {
      prv.ctx.clearRect (0, 0, prv.$cvs.width, prv.$cvs.height)
      prv.ctx.save ()
      prv.ctx.beginPath ()
      prv.ctx.rect (0, 0, prv.width, prv.height)
      prv.ctx.clip ()

      drawAxis (prv.ctx, prv.graph, prv.x);
      drawAxis (prv.ctx, prv.graph, prv.y1);

      drawLegend (prv.ctx, prv);
      drawTitle (prv.ctx, prv);

      prv.ctx.beginPath ()
      prv.ctx.rect (prv.graph.x, prv.graph.y, prv.graph.w, prv.graph.h)
      prv.ctx.clip ()

      this.forEachGroup (function (grid) {
        jaks.Plotter[grid.plot].draw (prv.ctx, prv.graph, grid, prv.x);
        if (grid.mark != null) {
          drawMarkee (prv.ctx, prv.graph, grid, prv.x);
        }
      });

      this.trigger ('paint');
      prv.ctx.restore ()
    }

    var getMousePosition = function(evt) {
      var canvas = prv.ctx.canvas
      var rect = canvas.getBoundingClientRect();
      var x = evt.clientX - rect.left;
      var y = evt.clientY - rect.top;
      return {
        x: x,
        y: y
      };
    };


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

        window.addEventListener('mousemove', function(e) {
          var mouse = getMousePosition(e)
          that.mouseMotion (mouse);
        }, false);

      }, options.cvs);



    }
  };

}).apply (jaks);
