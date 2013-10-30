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
  jaks.Plotter['StackedColumn'] = {

    stepGap:true,
    summedValue:true,
    draw: function (ctx, rect, grid, abscissa)
    {
      var summedValue = []
      for (var idx = 0; idx < grid.data[0].length; ++idx) {
        jaks.Plotter['StackedColumn'].drawSerie(ctx, rect, grid, abscissa, idx, summedValue);
      }
    },

    drawSerie: function (ctx, rect, grid, abscissa, idx, summedValue)
    {
      ctx.lineWidth = grid.width;

      var gapf = abscissa.scale * 0.4
      var gaps = abscissa.scale * 0.1;
      var gapn = abscissa.scale * 0.8;

      ctx.strokeStyle = ctx.fillStyle = grid.colors[idx % grid.colors.length];
      for (var x = 0; x < grid.data.length; ++x) {
        vn = summedValue[x];
        if (vn == null)               vn = 0;
        vm = vn + grid.data[x][idx];
        if (v == null || isNaN(v))    continue;
        summedValue [x] = vm;

        px = rect.x + (abscissa.data[x][0] - abscissa.vwMin) * abscissa.scale;
        pny = rect.h + rect.y - (vn - grid.vwMin) * grid.scale;
        pmy = rect.h + rect.y - (vm - grid.vwMin) * grid.scale;
        ctx.beginPath();
        ctx.rect (px + gaps - gapf, pmy, gapn, pny - pmy);
        ctx.globalAlpha = (grid.selectedSerie == null 
          ? 0.6 
          : (grid.selectedSerie == idx 
            ? 0.6
            : 0.2));
        ctx.fill();
        ctx.globalAlpha = (grid.selectedSerie == null 
          ? 1.0 
          : (grid.selectedSerie == idx 
            ? 1.0
            : 0.4));
        ctx.stroke();
      }
    },

  }

}).apply (jaks);

