#!/bin/bash
set -e
npm run build
cordova build android
cordova run android
