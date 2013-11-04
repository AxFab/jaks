@ECHO OFF

:: name
set name=jaks

:: Version
set maj=1
set min=0
set ptc=0

:: create input output
set out=%name%-%maj%.%min%.%ptc%.js
set outm=%name%-%maj%.%min%.%ptc%.min.js
set outs=%name%.js
set outn=%name%.min.js

:: concatenate files
echo if (typeof exports == 'undefined') exports = {};  > %out%
echo jaks = exports;  >> %out%

for /f %%e in ('dir /b src\') do (
	echo src\%%e
	
	echo console.log ^( this, jaks ^) >>  %out%
	
	type src\%%e >>  %out%
)


	
:: minimize file

copy %out% %outs%

:: Deploy
copy %out% D:\Dropbox\axFab.net\js\%outn%



