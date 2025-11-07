@echo off

set GOOS=linux
set GOARCH=amd64

go build -o cyber .\main.go

echo compile finished: cyber
pause
