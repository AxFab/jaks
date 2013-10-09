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

  this.Markdown = function (data) 
  {
    var result = '';
  	var parseFile = function (brut) 
  	{
  		var idx = 0
  		var str = ''
  		var lg = brut.length
  		while (idx < lg) {

  			c = brut[idx++]
  			if (c == '\r') {
  				c = '\n' 
  				if (brut[idx] == '\n') {
  					idx++;
  				}
  			}

  			if (c == '\n') {
  				parseLine (str);
  				str = '';
  			}
  			else 
  				str += c;
  		}

      parseLine (str);
      commit();
  	}

	  var lastBlock = { text:'', type:'' }
  	var parseLine = function (line)
  	{
      // TODO > and * and #. can be nested !

  		if (line.trim() == '') {
        if (lastBlock.type == 'pre')
          addRegularText(line);
        else
        commit ('');
      } else if (line.startwith ('======')) {
        lastBlock.type = 'h1';
      } else if (line.startwith ('------')) {
        lastBlock.type = 'h2';
      } else if (line.startwith ('#')) {
        var s = 0;
        while (line.startwith('#')) {
          line = line.substring(1);
          s++;
        }
        commit ('h' + s);
        addRegularText(line);
      } else if (line.startwith ('    ')) {
        commit ('pre');
        addRegularText(line.substring(4));
  		} else {
        commit ('p');
        addRegularText(line);
      }
  	}

    var addRegularText = function (line) 
    {
      if (line.endswith ('  '))
        lastBlock.text += line.trim() + '\n';
      else
        lastBlock.text += line.trim() + '\n';
    }

    var addPreformatedText = function (line) 
    {
      lastBlock.text += line + '\n';
    }

    var fillSpec = function (id, lnk) 
    {
      lnk.url = 'wiki-id:' + id;
    }

    var formatSpec = function (block, idx) 
    {
      var pidx = idx;

      k = block.indexOf(']', idx)
      if (k < 0) return { lg:0 };
      var lnk = {
        inside: block.substring (idx, k),
        url: '',
        title: '',
      }
      lnk.url = 'wiki:' + lnk.inside;
      idx += lnk.inside.length + 1;

      if (block[idx] == '[') {
        k = block.indexOf(']', idx)
        if (k >= 0) {
          idx++;
          id = block.substring (idx, k);
          fillSpec(id, lnk);
          idx += id.length + 1;
        }
      } else if (block[idx] == '(') {
        k = block.indexOf(')', idx)
        if (k >= 0) {
          idx++;
          id = block.substring (idx, k);
          k = id.indexOf(' ')
          if (k > 0) {
            lnk.url = id.substring(0, k);
            lnk.title = id.substring(k + 1).trim();
            if (lnk.title.startwith('"'))
              lnk.title = lnk.title.substring(1, lnk.title.length-1) 
          } else {
            lnk.url = id;
          }
          idx += id.length + 1;
        }
      }

      lnk.lg = idx - pidx;
      return lnk;
    }

    var formatPreHTML = function (block)
    {
      var idx = 0;
      var lg = block.length
      var str = '';
      var itl = false, 
        bld = false, 
        pre = false;
      while (idx < lg) 
      {
        c = block [idx++];
        if (pre == true && c != '`')
          str += c;
        else {
          switch (c) {
            case '<':  str += '&lt;';  break;
            case '>':  str += '&gt;';  break;
            case '"':  str += '&quot;';  break;
            case '&':  str += '&amp;';  break;

            default:
              str += c;
          }
        }
      }
      return str;
    }

    var formatHTML = function (block)
    {
      var idx = 0;
      var lg = block.length
      var str = '';
      var itl = false, 
        bld = false, 
        pre = false;
      while (idx < lg) 
      {
        c = block [idx++];
        if (pre == true && c != '`')
          str += c;
        else {
          switch (c) {
            case '<':  str += '&lt;';  break;
            case '>':  str += '&gt;';  break;
            case '"':  str += '&quot;';  break;
            case '&':  str += '&amp;';  break;

            case '`':  
              if (block [idx] == '`') {
                str += '`'
                idx ++;
              } else  {
                str += (pre ? '</code>' : '<code>');
                pre = !pre;
              }
            break;

            case '*':  
              if (block [idx] == '*') {
                str += (bld ? '</b>' : '<b>');
                bld = !bld;
                idx ++;
              } else  {
                str += (itl ? '</i>' : '<i>');
                itl = !itl;
              }
            break;

            case '_':  
              if (block [idx] == '_') {
                str += (bld ? '</b>' : '<b>');
                bld = !bld;
                idx ++;
              } else  {
                str += (itl ? '</i>' : '<i>');
                itl = !itl;
              }
            break;

            case '[':  
              lnk = formatSpec(block, idx);
              idx += lnk.lg
              if (lnk.title != '')
                str += '<a href="' + lnk.url + '" title="' + lnk.title + '">' + lnk.inside + '</a>';
              else 
                str += '<a href="' + lnk.url + '">' + lnk.inside + '</a>';
              break;

            case '!':
              if (block [idx] == '[') {
                lnk = formatSpec(block, ++idx);
                idx += lnk.lg
                if (lnk.title != '')
                  str += '<img src="' + lnk.url + '" title="' + lnk.title + '" alt="' + lnk.inside + '" />';
                else 
                  str += '<img src="' + lnk.url + '" alt="' + lnk.inside + '" />';
              } else
                str += c;
              break;

            default:
              str += c;
          }
        }
      }
      return str;
    }


    var commit = function (type)
  	{
      if (typeof (type) == 'string' && lastBlock.type == type)
        return;

      if (lastBlock.type != '') {

        if (lastBlock.type != 'pre') {
          lastBlock.text = formatHTML (lastBlock.text);
  		    result += '<' + lastBlock.type + '>' + lastBlock.text.trim() + '</' + lastBlock.type + '>\n\n';
        } else {
          lastBlock.text = formatPreHTML (lastBlock.text);
          result += '<' + lastBlock.type + '><code>' + lastBlock.text.trim() + '</code></' + lastBlock.type + '>\n\n';
        }
      }

  		lastBlock = { text:'', type:type }
  	}

  	{
      if (typeof(data) == 'string')
        parseFile (data);
      else
        console.warn ('Markdown, data is undefined', data)
      return result;
  	}
  };

}).apply (jaks);

