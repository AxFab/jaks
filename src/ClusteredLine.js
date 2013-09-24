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
      for (var idx = 0; idx < grid.data[0].length; ++idx) {
        jaks.Plotter['ClusteredLine'].drawSerie(ctx, rect, grid, abscissa, idx);
      }
    },

    drawSerie: function (ctx, rect, grid, abscissa, idx)
    {
      var prev = NaN;
      ctx.lineWidth = grid.width;
      ctx.strokeStyle = grid.colors[idx % grid.colors.length];

      ctx.beginPath ();
      v = grid.data[0][idx];
      px = rect.x + (abscissa.data[0][0] - abscissa.vwMin) * abscissa.scale;
      py = rect.h + rect.y - (v - grid.vwMin) * grid.scale;
      for (var x = 0; x < grid.data.length; ++x) {
        v = grid.data[x][idx];
        if (v == null)
          continue;
        if (isNaN(v)) {
          ctx.stroke();
          prev = NaN;
        }
        px = rect.x + (abscissa.data[x][0] - abscissa.vwMin) * abscissa.scale;
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

