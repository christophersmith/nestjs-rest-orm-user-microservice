FROM mcr.microsoft.com/mssql/server:2019-latest
ENV ACCEPT_EULA y
ENV SA_PASSWORD S3cr3tD3v!
COPY ./mssql.init.sh .
COPY ./mssql.init.sql .
COPY ./mssql.entrypoint.sh .
EXPOSE 1433
CMD /bin/bash ./mssql.entrypoint.sh
