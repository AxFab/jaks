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

  if (jaks.Plotter == null) jaks.Plotter = {};
  jaks.Plotter['ClusteredColumn'] = {

    stepGap:true,
    draw: function (ctx, rect, grid, abscissa)
    {
      for (var idx = 0; idx < grid.data[0].length; ++idx) {
        jaks.Plotter['ClusteredColumn'].drawSerie(ctx, rect, grid, abscissa, idx);
      }
    },

    drawSerie: function (ctx, rect, grid, abscissa, idx)
    {
      ctx.lineWidth = grid.width;
      var series = grid.data[0].length;
      var gapf = abscissa.scale * 0.4
      var gaps = abscissa.scale * 0.1;
      var gapn = (abscissa.scale * 0.8 - gaps * (series-1)) / series;
      var gapm = gapn + gaps

      // var gapn = abscissa.scale * 0.8 / data[0][group].length - grid.width; //20; // 

      ctx.strokeStyle = ctx.fillStyle = grid.colors[idx % grid.colors.length];
      for (var x = 0; x < grid.data.length; ++x) {
        v = grid.data[x][idx];
        if (v == null || isNaN(v)) 
          continue;
        px = rect.x + (abscissa.data[x][0] - abscissa.vwMin) * abscissa.scale;
        py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
        ctx.beginPath();
        // ctx.rect (px + gapm * idx + gapf, py, gapn, rect.h + rect.y - py);
        ctx.rect (px + gapm * idx - gapf, py, gapn, rect.h + rect.y - py);
        //ctx.rect (px + gapf, py, 10, rect.h + rect.y - py);
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha=1.0;
        ctx.stroke();
      }
    },

  }


}).apply (jaks);

