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
  jaks.Plotter['ClusteredLine'] = {

    draw: function (ctx, rect, grid, abscissa)
    {
      for (var idx = 0; idx < grid.data.length; ++idx) {
        jaks.Plotter['ClusteredLine'].drawSerie(ctx, rect, grid, abscissa, idx);
      }
    },

    drawSerie: function (ctx, rect, grid, abscissa, idx)
    {
      var prev = NaN;
      ctx.lineWidth = grid.width;
      ctx.strokeStyle = grid.colors[idx % grid.colors.length];

      ctx.beginPath ();
      var v = grid.data[idx][0];
      var px = rect.x;
      var py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
      for (var x = 0; x < grid.data[idx].length; ++x) {
        v = grid.data[idx][x];
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
      
    },

  }

}).apply (jaks);

