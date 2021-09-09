# Jira 2 Things CLI

> This is the source code for Jira 2 Things CLI

## 👨‍💻 About

This CLI application is created with Node.js. It's sole purpose it to get all the tasks for a given user from a sprint in Jira and create a new project for them in Things 3 for Mac; each story is given it's own heading with the tasks nested beneath it within the project.

At the moment there are no plans to sync back any changes in Things back to Jira.

> This currently creates a new project each time the script is run. This is an outstanding to-do to allow updating.

---

## 🛠️ Development

### Prerequisites

#### Atlassian

You must have access to an Atlassian account, active Sprint Board and be able to generate an API token.

#### Internet

The development process for this application requires an internet connection in order to fetch data from Atlassian.

### Setup

Once you have cloned the repository, install the node dependencies from the root directory.

```bash
$ yarn install
# or with npm
$ npm install
```

You will need to create a `.env` for development by copying `example.env` at the root of the project and provide the required environment variables. Some values in the `example.env` have been pre-populated or partially pre-populated for ease.

#### Environment Variables

| Variable           | Required | Description                                                                                                                                                                                                                                                             |
| ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| THINGS_URL         | Yes      | [URL scheme for Things](https://culturedcode.com/things/support/articles/2803573/) with a JSON payload. This value is pre-populated in the example.                                                                                                                     |
| THINGS_AREA        | Optional | This will place the newly created project in a designated area of Things.                                                                                                                                                                                               |
| JIRA_AUTH          | Yes      | Base64 encoded authentication string for Jira. Please refer to [Atlassian's documentation](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/#get-an-api-token) for details on how to get an API token and encode the authentication string. |
| JIRA_SPRINT_URL    | Yes      | API endpoint for sprints. This value is pre-populated in the example but the <ID> will need to be replaced with the relative account.                                                                                                                                   |
| JIRA_ISSUE_URL     | Yes      | API endpoint for issues. This value is pre-populated in the example but the <ID> will need to be replaced with the relative account.                                                                                                                                    |
| JIRA_EMAIL_ADDRESS | Yes      | Email address for the user. This will be used to find the assigned tasks.                                                                                                                                                                                               |

### Development

To start the application, run the following from the project root:

```bash
# launch gatsby development server
$ yarn start
# or with npm
$ npm run start
```

> You will need to add a Sprint ID as an argument to the start command e.g `"start": "node index.js 1234"` where `1234` is the Sprint ID. For information on how to get a Sprint ID, please see [here](https://confluence.atlassian.com/jirakb/jira-software-how-to-search-for-a-sprint-using-jql-779159065.html).

Alternatively you can use [yarn link](https://classic.yarnpkg.com/en/docs/cli/link/) or [npm-link](https://docs.npmjs.com/cli/v7/commands/npm-link). Using this method you can then run `j2t` followed by a Sprint ID from anywhere in the terminal.

---

## Distribution

This application is not currently packaged for distribution. This repo will need to be cloned and then used with either [yarn link](https://classic.yarnpkg.com/en/docs/cli/link/) or [npm-link](https://docs.npmjs.com/cli/v7/commands/npm-link) to run.

---

## Usage

### Create

> This is currently the _only_ available option.

The following command will fetch all tasks for a given sprint and place them into a new project in Things. For information on how to get a Sprint ID, please see [here](https://confluence.atlassian.com/jirakb/jira-software-how-to-search-for-a-sprint-using-jql-779159065.html).

```bash
j2t <SPRINT ID>
```

---

## 📚 TODO

- [ ] Add argument option to update existing Things project.
- [ ] Explore adding tags e.g labels from the task/story or associated epic could be a tag.
- [ ] Explore adding when and deadline.
