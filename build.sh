#!/bin/sh
cd functions

# -- Add activedirectory function ---
rm -f -r activedirectory
git clone https://github.com/onify/hub-function-activedirectory activedirectory
cd activedirectory
npm install