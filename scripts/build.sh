#!/bin/bash

# Build script for ChatScript server 
# script powered by Bash Shell

build_dir=$2
root_dir='../'

case $1 in 
    client)
        cp -r ../client ${build_dir}/
        mkdir ${build_dir}/client/modules
        cp ../modules/Log.js ${build_dir}/client/modules/Log.js
        cp ../modules/Terminal.js ${build_dir}/client/modules/Terminal.js
        cp ../modules/Message.js ${build_dir}/client/modules/Message.js
    server)
        cp -r ../server ${build_dir}
	cp -r ../modules ${build_dir}/server/threads
esac

exit 0
