#!/bin/bash

#name
name='jaks'

# Version
maj=1
min=0
ptc=0

# create input output
out=$name'.'$maj'.'$min'.'$ptc'.js'
outm=$name'.min.'$maj'.'$min'.'$ptc'.js'
outs=$name'.js'

# test target
if [ ! -f $in ]; then
	echo "Invalid target " 1>&2
	exit 1
fi

# concatenate files
echo 'jaks = {};' > $out
for src in `find src/ -name '*.js'`; do
	cat $src >> $out
done

# minimize file
ret=`which jsmini 2>&1`
if [[ $? == 0 ]]; then
	jsmini -o $outm $out
fi

cp $out $outs

