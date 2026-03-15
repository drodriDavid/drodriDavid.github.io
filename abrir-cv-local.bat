@echo off
setlocal

cd /d "%~dp0"

set "PY_CMD="
where py >nul 2>nul
if %errorlevel%==0 set "PY_CMD=py -3"

if not defined PY_CMD (
  where python >nul 2>nul
  if %errorlevel%==0 set "PY_CMD=python"
)

if not defined PY_CMD (
  echo No se encontro Python en este equipo.
  echo Instala Python y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

echo Iniciando servidor local...
start "CV local" cmd /k "%PY_CMD% server.py"

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8081/cv-completo.html"

echo La web local se ha abierto en el navegador.
echo Si no carga a la primera, espera unos segundos y recarga.
endlocal
