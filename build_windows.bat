@echo off

set GOOS=windows
set GOARCH=amd64

go build -o app.exe .\main.go

echo compile finished: app.exe
pause