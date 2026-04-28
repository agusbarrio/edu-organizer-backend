### QA DOCKER DEPLOYMENT

#### MySQL

docker run --name mysql -v <MYSQL_LOCAL_DATA_PATH>:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<PASSWORD> -d mysql

#### Upload images

docker volume create edu_organizer_qa_uploads --opt type=none --opt device=<UPLOADS_LOCAL_DATA_PATH> --opt o=bind

#### Build image

- QA
  docker build -t edu-organizer-backend-qa .

- PRD
  docker build -t edu-organizer-backend-prd .

#### Run container

- QA
  docker compose -p eduorg-qa -f docker-compose.qa.yml up -d

- PRD
  docker compose -p eduorg-prd -f docker-compose.prd.yml up -d

#### Stop container

- QA
  docker compose -p eduorg-qa -f docker-compose.qa.yml down

- PRD
  docker compose -p eduorg-prd -f docker-compose.prd.yml down

#### Important

- If you deploy QA and PRD from the same repository path, always pass `-p` with different project names.
- Do not run `docker compose ...` without `-p` in this repository, or services from QA/PRD can be recreated unexpectedly.
