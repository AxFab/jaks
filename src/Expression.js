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

    this.parse = function (expr, rules) 
    {
      var lexer = new jaks.Lexer (expr, rules);

      while (!lexer.endOfFile()) {

        token = lexer.getToken();
        this.pushToken(token);
      }

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

    var no = 1;
    this.translate = function (instr) {
      // GET ALL OTHER

 /*
      switch (instr.literal) {
        case '+':     console.log ('ADD', '$'+(no++), instr.0.value, instr.1.value);  break;
        case '+=':    console.log ('ADD', '$'+no, instr.0.value, instr.1.value);    
                      console.log ('MOV', instr.0.value, '$'+(no++));                 break;
        case '-':     console.log ('SUB', '$'+(no++), instr.0.value, instr.1.value);  break;
        case '-=':    console.log ('SUB', '$'+no, instr.0.value, instr.1.value);    
                      console.log ('MOV', instr.0.value, '$'+(no++));                 break;
        case '*':     console.log ('MUL', '$'+(no++), instr.0.value, instr.1.value);  break;
        case '*=':    console.log ('MUL', '$'+no, instr.0.value, instr.1.value);    
                      console.log ('MOV', instr.0.value, '$'+(no++));                 break;
        case 'CALL':  console.log ('PUSH', instr.2.value);
                      console.log ('PUSH', instr.1.value);
                      console.log ('CALL', instr.0.value, );                          break;
      }
      */
    }

  
    var that = this;
    {
      if (expr == null)
        return;

      console.log ('LOOK FOR', expr);

      this.parse (expr, rules);
      this.compile();

    }
  }

}).apply (jaks);

/*
var nullDataProvider = {
  get: function (row, field) { return null },
  set: function (row, field, value) {},
  rows: function () { return 1; }
}

var DBProvider = {
  get: function (row, field) { 
    var query = "SELECT {field} FORM {table} WHERE numrow={row}";
  },
  set: function (row, field, value) {
    var query = "UPDATE {table} SET {field}={value} WHERE numrow={row}";
  },
  rows: function () { 
    var query = "SELECT max(numrow) FORM {table}";
  }
}

var MongoProvider = {
  get: function (row, field) { 
    db.{table}.find ( { numrow:row } )[field];
  },
  set: function (row, field, value) {
    var obj = db.{table}.find ( { numrow:row } )
    obj[field] = value;
    obj.save ();
  },
  rows: function () { 
    db.{table}.count ();
  }
}

*/

jaks.jaksLangRules = {
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


