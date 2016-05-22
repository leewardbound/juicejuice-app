#!/bin/bash
set -e
cordova build android
npm run build
cordova run android
./android_js_logs.sh
