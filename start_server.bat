@echo off
title AgriVision Platform Local Web Server
echo ==========================================================
echo Starting AgriVision Platform Local Web Server...
echo ==========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause

