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

  this.Expression = function (expr, rules) 
  {
    var prv = {
      tabs:4,
      str:expr,
      cur:0,
      row:0,
      col:0,
      peek:null,
    };

    if (rules == null)
      rules = cRules;

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

    var stackToken = [];
    var subExpr = [];
    var curSub = null;
    this.pushToken = function (token) 
    {
      console.log ('PUSH ', token)
      if (top != null)
        return;

      if (curSub != null) {
        ret = subExpr[curSub].pushToken (token);

        if (ret == 'next') {
          console.log ('  get next !')
          subExpr[curSub].compile ();
          curSub = subExpr.length;
          subExpr[curSub] = new jaks.Expression ();
          stackToken[stackToken.length-1].idx.push(curSub);

        } else if (ret == 'done') {
          console.log ('  get done !')
          subExpr[curSub].compile ();
          curSub = null;
        }

        return;
      }

      if (token.literal == '(') {

        if (stackToken[stackToken.length-1].type == 'identifier') {

          console.log ('  Function call')
          curSub = subExpr.length;
          subExpr[curSub] = new jaks.Expression ();
          stackToken.push({ type:'operator', literal:'CALL', idx:[curSub], child:1 });

        } else {

          console.log ('  Undefiend open parenthesis')
        }

        return;
      } 

      if (token.literal == ',')   return 'next';
      if (token.literal == ')')   return 'done';

      stackToken.push(token);
    }

    var top = null;
    this.compile = function() 
    {
      var stackVar = [],
        stackOper = [];
      while (stackToken.length > 0) {
        var token = stackToken.pop();
        if (token.type == 'operator')
          stackOper.push(token);
        else
          stackVar.push(token);
      }


      while (stackOper.length > 0) {
        var token = stackOper.pop();

        if (top == null) {
          var oLeft = stackVar.pop();
          var oRight = stackVar.pop();
          top = { 
            operator: token, 
            0:oLeft, 
            1:oRight 
          };
        } else {
          if (true /* top.operator.prio < token.prio */) {
            var instr = {
              operator: token, 
              0:top, 
              1:stackVar.pop()
            }
            top = instr;
          } else {
            var oLeft = top;
            while (oLeft.right.operator.prio > token.prio) {
              oLeft = oLeft.right;
            }
            var instr = {
              operator: token, 
              0:oLeft.right, 
              1:stackVar.pop()
            }
            oLeft.right = instr;
          }

        }


      }

      console.log (top);
    }

  
    var that = this;
    {
      while (!lexer.endOfFile()) {

        token = lexer.getToken();
        this.pushToken(token);
      }

      if (expr == null)
        return;

      console.log ('LOOK FOR', expr);

      this.parse (expr, rules);
      this.compile();

    }
  }

}).apply (jaks);


var cRules = {
    id:[
      {
        first:['a-z', 'A-Z', '_', '$' ],
        get:function (lexer, str) {
          for (;;) {
            c = lexer.peekChar ();
            if (c == null) return str;
            if ((c >= '0' && c <= '9') || 
                (c >= 'a' && c <= 'z') || 
                (c >= 'A' && c <= 'Z') || 
                c == '_' || c == '$') {
              str = str + lexer.getChar();
            } else return str;
          }
        },
        name:'identifier'
      },
      {
        first:['0-9'],
        get:function (lexer, str) {

          var floatNum = function (lexer, str) {
            str = decimalNum (lexer, str);

            for (;;) {
              c = lexer.peekChar ();
              switch (c) {
                case '.':
                  if (str.indexOf('.' > 0))
                    return str;
                  str = str + '.' + decimalNum(lexer, '');
                  break;
                case 'e':
                case 'E':
                  c = lexer.getChar();
                  c = lexer.peekChar ();
                  str = str + 'E';
                  if (c == '+' || c == '-') {
                    str = str + lexer.getChar();
                  }
                  return str + decimalNum(lexer, '');
                  break;
              }
            }
          }

          var decimalNum = function (lexer, str) {
            for (;;) {
              c = lexer.peekChar ();
              if (c == null) return str;


              if ((c >= '0' && c <= '9')) {
                str = str + lexer.getChar();
              } else return str;
            }
          }

          var hexNum = function (lexer, str) {
            for (;;) {
              c = lexer.peekChar ();
              if (c == null) return str;
              if ((c >= '0' && c <= '9') || 
                  (c >= 'a' && c <= 'f') || 
                  (c >= 'A' && c <= 'F')) {
                str = str + lexer.getChar();
              } else return str;
            }
          }

          var octalNum = function (lexer, str) {
            for (;;) {
              c = lexer.peekChar ();
              if (c == null) return str;
              if ((c >= '0' && c <= '7')) {
                str = str + lexer.getChar();
              } else return str;
            }
          }

          if (str.length == 0) {
            if (c >= '0' && c <= '9')
                str += lexer.getChar();
            else
              return str;
          }

          if (str.startwith('0')) {

            if (str.length == 1) {
              c = lexer.peekChar();
              if (c >= '0' && c <= '7' ||
                c == 'x' || c == '.')
                str += lexer.getChar();
              else
                return str;
            }

            if (str.startwith('0x'))
              return hexNum(lexer, str);
            else if (str.startwith('0.'))
              return floatNum();
            else             
              return octalNum(lexer, str);

          } else {

            str = decimalNum(lexer, str);

            if (lexer.peekChar == '.')
              return floatNum(lexer, str);
            return str;
          }
        },
        name:'number'
      },
    ],

    operators:[
      '+=', '-=', '*=', '-=', '%=',
      '+', '-', '*', '-', '%',
      '++', '--', 
      '(', ')', '{', '}', '[', ']', 
      '&=', '|=', '^=', '<<=', '>>=',
      '&', '|', '^', '<<', '>>',
      '<', '>', '<=', '>=', '==', '!=', 
      '=', '&&', '||', '~', '!',
      ',', '.', '->', '=>', ':', '::' ],
    delimiters:[
      { open:'\'', close:'\'', escape:'\\' },
      { open:'"', close:'"', escape:'\\' },
      { open:'/*', close:'*/' }
    ],
    blank:[' ', '\t', '\r', '\n'],
  };

