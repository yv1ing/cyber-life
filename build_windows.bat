@echo off

set GOOS=windows
set GOARCH=amd64

go build -o cyber.exe .\main.go

echo compile finished: cyber.exe
pause