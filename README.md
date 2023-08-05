### QA DEPLOYMENT

docker build -t edu-organizer-backend-qa .
docker run -d -p 8081:8080 -e NODE_ENV=qa --env-file .env.qa --add-host host.docker.internal:host-gateway edu-organizer-backend-qa
