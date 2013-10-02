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

  this.Lexer = function (data, rules, options) 
  {
    var prv = {
      tabs:4,
      str:data,
      cur:0,
      row:0,
      col:0,
      peek:null,
    };

    if (rules == null)
      rules = jaks.LangRules;

    var checkIdent = function (lexer, rules) {
      for (var i =0; i < rules.id.length; ++i) {
        var id = rules.id[i];
        for (var j=0; j < id.first.length; ++j) {
          if (id.first[j].length == 1 && id.first[j] == lexer.peekChar())
            return { type:id.name, literal:id.get (lexer, '') };
          else if (id.first[j].length == 3 && 
              id.first[j][0] <= lexer.peekChar() && 
              id.first[j][2] >= lexer.peekChar() ) {
            return { type:id.name, literal:id.get (lexer, '') };
          } 
        }
      }
    }

    var checkOper = function (lexer, rules) {
      var str = '';
      pId = null;
      for (;;) {
        str += lexer.peekChar ();
        m = 0;
        id = null;
        for (var i =0; i < rules.operators.length; ++i) {
          if (rules.operators[i].startwith(str)) {
            m++;
            if (str.length == rules.operators[i].length)
              id = i;
          }
        }

        if (m == 0 && pId != null)
          return { type:'operator', literal:rules.operators[pId] };
        if (m == 0)
          return null;
        if (m == 1 && id != null) {
          lexer.getChar();
          return { type:'operator', literal:str };
        }
        lexer.getChar();
        pId = id;
      }
    }

    var checkDelimiter = function (lexer, rules) {

    }


    this.endOfFile = function () {
      return (prv.cur >= prv.str.length)
    }

    this.peekChar = function () {
      if (prv.peek == null)
        prv.peek = this.getChar();
      return prv.peek
    }


    this.getChar = function () {
      if (prv.peek != null) {
        var ret = prv.peek;
        prv.peek = null;
        return ret;
      }

      if (prv.cur >= prv.str.length)
        return null;

      c = prv.str[prv.cur++];
      if (c == '\r') {
        if (prv.str[prv.cur] == '\n')
          prv.cur++;
        c = '\n';
      }
      if (c == '\n') {
        prv.row++;
        prv.col = 0
      } else if (c == '\t') {
        prv.col += prv.tabs - prv.col % prv.tabs;
      } else {
        prv.col ++;
      }

      return c;
    }

    this.getToken = function () {

      c = this.peekChar();

      while (rules.blank.contains (c)) {
        this.getChar ();
        c = this.peekChar();
      } 

      str = checkIdent (this, rules);
      if (str) return str;

      str = checkOper (this, rules);
      if (str) return str;

      str = checkDelimiter (this, rules);
      if (str) return str;

      return null;
    }

    var that = this
    {

    }
  }

}).apply(jaks);

