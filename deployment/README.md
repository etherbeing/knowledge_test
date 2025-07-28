# Deployment Files

## Stack

In order to make two in one lets discuss the stack and deployment ways here:
1. cockroachdb as a distributed DB for having both the requirements for distributed and an SQL db.
2. Handled a distributed storage with glusterFS for matching the requirements of multiple services for our backend, so stored files are accessed everywhere.
3. Ruff as the linter, this only matter for CI not for CD but still will be here as having constancy of what are all the deps, we aren't using Trunk CI because so far is too heavy in RAM and CPU usage...
4. Units Testings are a must in each building process let's make it imperative by including UTs inside the Dockerfile
5. Use conventionalcommits for Commits
6. Celery and Redis for automating tasks and reminders.
7. MinioS3 for S3 compatible media storage... This must be integrated with the DFS.
8. CD for notifying on deployment to discord perhaps?

