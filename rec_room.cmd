cd xClient
start node app.js %*
cd ..\client
:: save to file
start node danmu2.js %* 1
cd ..
