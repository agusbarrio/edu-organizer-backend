### DOCKER DEPLOYMENT

#### MySQL

docker run --name mysql -v <MYSQL_LOCAL_DATA_PATH>:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<PASSWORD> -d mysql

#### Files

New uploads go to RustFS. Set these variables in `.env.qa` and `.env.prd`:

- `RUSTFS_ENDPOINT` — URL the API uses for uploads and deletes. Signed URLs use this host too.
- `RUSTFS_PUBLIC_ENDPOINT` — optional. Set it when the browser must use a different host than `RUSTFS_ENDPOINT`. The signature is built with this host.
- `RUSTFS_BUCKET`
- `RUSTFS_ACCESS_KEY_ID`
- `RUSTFS_SECRET_ACCESS_KEY`
- `RUSTFS_REGION` — optional, default `us-east-1`
- `RUSTFS_SIGNED_URL_EXPIRES_SECONDS` — optional, default `300`

Allow the frontend origin on the bucket CORS config for `GET`. Responses put that signed URL in the existing `file` field.

#### Build image

- QA
  docker build -t edu-organizer-backend-qa .

- PRD
  docker build -t edu-organizer-backend-prd .

#### Stop container

- QA
  docker compose -p eduorg-qa -f docker-compose.qa.yml down

- PRD
  docker compose -p eduorg-prd -f docker-compose.prd.yml down

#### Run container

- QA
  docker compose -p eduorg-qa -f docker-compose.qa.yml up -d

- PRD
  docker compose -p eduorg-prd -f docker-compose.prd.yml up -d

#### Important

- If you deploy QA and PRD from the same repository path, always pass `-p` with different project names.
- Do not run `docker compose ...` without `-p` in this repository, or services from QA/PRD can be recreated unexpectedly.
