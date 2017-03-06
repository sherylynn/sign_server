start /min cmd /c j -f ./about/users.xlsx -N 0 -j -o ./about/0.json
start /min cmd /c j -f ./about/users.xlsx -N 1 -j -o ./about/1.json 
start /min cmd /c j -f ./about/users.xlsx -N 2 -j -o ./about/2.json 
start /min cmd /c j -f ./about/users.xlsx -N 3 -j -o ./about/3.json 
start /min cmd /c j -f ./about/users.xlsx -N 4 -j -o ./about/4.json 
start /min cmd /c j -f ./about/users.xlsx -N 5 -j -o ./about/5.json 
start /min cmd /c j -f ./about/users.xlsx -N 6 -j -o ./about/6.json
start /min cmd /c j -f ./about/users.xlsx -N 7 -j -o ./about/7.json  
@echo off cat ./about/*.json | json -g >> ./about/fuck.shit