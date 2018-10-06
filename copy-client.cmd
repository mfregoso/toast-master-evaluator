if not exist "TCM.Web\Client" mkdir TCM.Web\Client
del /f /s /q TCM.Web\Client\*.* > NUL
xcopy /q /e react\build\*.* TCM.Web\Client
dir TCM.Web\Client
