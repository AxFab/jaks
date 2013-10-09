

if (require.main === module) {

  /* Modules */
  var fs = require('fs');
    jaks = require('./jaks.js');

  /* Options */
  var command = process.argv[2]
  var files = []
  var options = {}
  for (var i=3; i< process.argv.length; ++i) {
    if (process.argv[i].startwith ('--')) {
      options[process.argv[i]] = true;
    } else if (process.argv[i].startwith ('-')) {
      for (var j=1; j<process.argv[i].length; ++j)
        options[process.argv[i][j]] = true;
    } else {
      files.push (process.argv[i]);
    }
  }

  /* Command */
  switch (command) 
  {
    case 'markdown':
      for (var i=0; i<files.length; ++i) {
        var chunk = fs.readFileSync(files[i]);
        var data = chunk.toString('utf8');
        console.log (jaks.Markdown (data));
      }
      break;

    case 'expression':
      for (var i=0; i<files.length; ++i) {
        var ex = jaks.Expression (files[i]);
        console.log (ex);
      }
      break;
      
    default:
      console.error ('Unknow command "' + command + '"');
  }
}

