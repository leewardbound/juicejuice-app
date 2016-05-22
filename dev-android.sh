#!/bin/bash
set -e
npm run build
cordova run android
./android_js_logs.sh
