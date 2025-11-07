@echo off

set GOOS=linux
set GOARCH=amd64

go build -o app .\main.go

echo compile finished: app
pause
