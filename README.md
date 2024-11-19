# Theater-Air-Evac-System-Frontend

## Installation

Ensure VSCode is installed with the appropriate extensions for GitLab Workflow, Docker, & a Package Manager such as yarn or npm.

Additionally, the Docker Desktop application is a great visual interface for managing Docker containers & images.
Just select the appropriate [Docker Installation](https://www.docker.com/) type and install it if you don't already have it.

Clone the repository to your local machine.

This command installs the dependencies required for the project once the above prerequisites have been met.

If using yarn:
```bash
yarn install 
```
If using npm:
```bash
npm install
```

Next you'll need to build and run the image locally using the docker commands in the next section within a bash terminal.

Note: `REDACTED_GITLAB_USERNAME` should be replaced by your GitLab username & 'REDACTED_GITLAB_PAT' should be replaced by your GitLab personal access token.

```Personal Access Token Creation Steps
1. On the left sidebar, select your avatar.
2. Select Edit profile.
3. On the left sidebar, select Access tokens.
4. Select Add new token.
5. Enter a name and expiry date for the token.
6. Select the desired scopes.
7. Select Create personal access token.
```
Further documentation on Personal Access Tokens can be found [here](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

## Docker
Production Container
```bash
docker login registry.bespin.cce.af.mil -u REDACTED_GITLAB_USERNAME -p REDACTED_GITLAB_PAT
docker build -t taes-web --platform linux/amd64 --build-arg CI_REGISTRY=registry.bespin.cce.af.mil .
docker run --platform linux/amd64 -p 3000:3000 taes-web
```

Development Container
```bash
npm run dockerdev-build
npm run dockerdev-run
```

These commands should report your local site is at http://localhost:3000.