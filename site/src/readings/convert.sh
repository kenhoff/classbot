#!/bin/bash

for i in $( ls ); do
	if [[ ($i != "index.js") && ($i != "convert.sh") && ($i != "converted")]]; then
		echo item: $i
		eval cp $i $(echo $i | sed 's/^/converted\//' | sed 's/mrkdwn/md/')
	fi
done
