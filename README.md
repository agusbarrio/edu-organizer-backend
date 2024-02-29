### QA DOCKER DEPLOYMENT

#### MySQL

docker run --name mysql -v <MYSQL_LOCAL_DATA_PATH>:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<PASSWORD> -d mysql

#### Upload images

docker volume create edu_organizer_qa_uploads --opt type=none --opt device=<UPLOADS_LOCAL_DATA_PATH> --opt o=bind

#### Build image

docker build -t edu-organizer-backend-qa .

#### Run container

docker run -v edu_organizer_qa_uploads:/app/uploads -d -p 8081:8080 -e NODE_ENV=qa --env-file .env.qa --add-host host.docker.internal:host-gateway edu-organizer-backend-qa
