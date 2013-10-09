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

:: concatenate files
echo if (exports == null) exports = {};  > %out%
echo jaks = exports;  >> %out%

for /f %%e in ('dir /b src\') do (
	echo src\%%e
	type src\%%e >>  %out%
)


	
:: minimize file

copy %out% %outs%

