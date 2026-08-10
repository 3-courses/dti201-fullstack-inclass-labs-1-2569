# DTI201 Full-Stack In-Class Labs

Public in-class lab repository for **DTI 201: Full-Stack Software Development Skills**, semester **1/2569**.

This repository contains hands-on lab notes used during class. The main course planning, rubrics, student-project templates, and official course outline live in the companion course repository:

- https://github.com/3-courses/dti-fullstack

## Purpose

This repo is intentionally smaller than the main course repo. It should be easy for students to open during class, find the current lab, follow the commands, and keep their own work in their personal or team project repositories.

Use this repo for:

- in-class lab walkthroughs;
- Git/GitHub workflow practice;
- frontend and React practice;
- API, database, Docker, deployment, and troubleshooting labs;
- reusable diagrams and public teaching assets.

Do **not** use this repo for:

- student submissions;
- grades or class lists;
- private feedback;
- secrets, `.env` files, tokens, API keys, passwords, or private keys;
- generated `node_modules`, build outputs, or large unrelated files.

## Lab Sequence

| Lab | Topic | File |
|---:|---|---|
| 01 | GitHub workflow, branch, pull request, CI/CD, GitHub Pages | [labs/01-github-workflow.md](labs/01-github-workflow.md) |
| 02 | Create a SPA with Vite and React | [labs/02-vite-react-spa.md](labs/02-vite-react-spa.md) |
| 03 | JavaScript module systems | [labs/03-javascript-module-systems.md](labs/03-javascript-module-systems.md) |
| 04 | Debugging previous code | [labs/04-debugging-previous-code.md](labs/04-debugging-previous-code.md) |
| 05 | Database connection practice | [labs/05-database-connection-practice.md](labs/05-database-connection-practice.md) |
| 06 | API endpoint testing with `curl` | [labs/06-api-endpoint-testing-with-curl.md](labs/06-api-endpoint-testing-with-curl.md) |
| 07 | Docker fundamentals | [labs/07-docker.md](labs/07-docker.md) |
| 08 | Git CLI and Git workflow | [labs/08-git-cli-and-workflow.md](labs/08-git-cli-and-workflow.md) |
| 09 | Docker commands and web hosting | [labs/09-docker-commands-and-web-hosting.md](labs/09-docker-commands-and-web-hosting.md) |
| 10 | Deploy MERN stack on AWS EC2 | [labs/10-deploy-mern-stack-on-aws-ec2.md](labs/10-deploy-mern-stack-on-aws-ec2.md) |
| 11 | Container and local port troubleshooting | [labs/11-container-and-local-port-troubleshooting.md](labs/11-container-and-local-port-troubleshooting.md) |

## Suggested Weekly Use

The semester course plan may introduce additional labs or reorder items. In class, the instructor will announce which lab is current. Students should treat each lab as a guided practice session, not as a final project template.

Recommended student routine:

1. Open the current lab note.
2. Create or switch to a practice repository/branch.
3. Follow the commands carefully.
4. Save evidence: screenshots, command outputs, API responses, or short notes.
5. Add one Learning Journey entry in the main student project repo.
6. Commit work with a short English commit message.

## Provenance

Initial materials were adapted from last year’s public lab repository:

- https://github.com/wdiazcarballo/DTI201-FullStack-Course.git

Changes for 1/2569:

- moved reusable lab notes into `labs/`;
- renamed files with stable numeric slugs;
- copied public teaching assets into `assets/`;
- excluded the old 2568 course-outline PDF;
- added this README and public-repo hygiene rules.

## Repository Hygiene

Before pushing, check:

```bash
git status --short
```

The following should not appear in commits:

- `.env`
- `node_modules/`
- `dist/`, `build/`, `.vite/`, `.next/`
- private keys, AWS keys, GitHub tokens, database passwords
- student lists, scores, private feedback, or individual reports
- large archives or media files unrelated to the public lab

## Maintainer Notes

When adding a new lab:

1. Use the next numeric slug: `labs/12-topic-name.md`.
2. Add the lab to the table above.
3. Keep commands copy-pasteable.
4. Use placeholders for credentials.
5. Add explicit cleanup/stop commands for server, Docker, or cloud labs.
6. Add a short evidence checklist at the end of the lab.

## License

License is not yet declared. Until a license is added, treat the materials as public course materials for viewing and class use, with reuse subject to the repository owner’s permission.
