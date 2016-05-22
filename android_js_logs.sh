#!/bin/bash
adb logcat | grep -v "Content-Security-Policy" | grep -v "already defined" | grep "/chromium"
