<!DOCTYPE html>
<html>
    <head>
        <title>Garrizon Backend - Diagnostic</title>
    </head>
    <body>
        <h1>Garrizon Backend Diagnostic Page</h1>
        <p>
            If you can see this page, the WAR file was deployed successfully by
            Tomcat.
        </p>
        <p>Timestamp: <%= new java.util.Date() %></p>
        <p>Server Info: <%= application.getServerInfo() %></p>
    </body>
</html>
