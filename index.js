#!/usr/bin/env node
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })
const axios = require("axios")
const open = require("open")

const options = {
  headers: {
    Accept: "application/json",
    Authorization: `Basic ${process.env.JIRA_AUTH}`,
  },
}

async function getSprintName(sprintId) {
  const request = await axios.get(
    `${process.env.JIRA_SPRINT_URL}${sprintId}`,
    options
  )
  return request.data.name
}

async function getSprintTasks(sprintId) {
  const request = await axios.get(
    `${process.env.JIRA_SPRINT_URL}${sprintId}/issue`,
    options
  )

  let stories = []

  for (const issue of request.data.issues) {
    // A sprint will contain all issue types, we need to only catch issues of type 'story'.
    if (issue.fields.issuetype.name.toLowerCase() === "story") {
      console.log(`🤖 Story: ${issue.key}`)
      let story = [
        {
          type: "heading",
          attributes: {
            title: `${issue.key} - ${issue.fields.summary}`,
          },
        },
      ]

      const tasks = await getSubtasks(issue.key)
      console.log(
        `📚 Story has ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`
      )

      if (tasks.length) {
        // Spread the story and tasks to remove the wrapping arrays from them, so we'll have two objects in an array.
        story = [...story, ...tasks]
        // Spread the story into the stories array so we end up with stories containing an array of objects.
        stories = [...stories, ...story]
      }
    }
  }

  return stories
}

async function getSubtasks(storyKey) {
  console.log(`🚗 Getting subtasks for story: ${storyKey}`)

  const request = await axios.get(
    `${process.env.JIRA_ISSUE_URL}${storyKey}`,
    options
  )
  const tasks = []

  // If a story has no subtasks, nothing more is required.
  if (!request.data.fields.subtasks.length) {
    console.log(`❎  No subtasks attached to story: ${storyKey}`)
    return tasks
  }

  for (const task of request.data.fields.subtasks) {
    const taskData = await getTask(task.key)

    if (taskData !== null) {
      tasks.push(taskData)
    }
  }

  console.log(`⛵ Total subtasks for ${storyKey}: ${tasks.length}`)
  return tasks
}

async function getTask(taskKey) {
  const request = await axios.get(
    `${process.env.JIRA_ISSUE_URL}${taskKey}`,
    options
  )
  console.log(`🏃‍♂️ Getting data for task ${taskKey}`)

  if (
    request.data.fields?.assignee?.emailAddress ===
    process.env.JIRA_EMAIL_ADDRESS
  ) {
    console.log(`🔎 Found a task for this user`)
    return {
      type: "to-do",
      attributes: {
        title: request.data.fields.summary,
        notes: request.data.fields.description || "",
        completed:
          request.data.fields.status.statusCategory.name.toLowerCase() ===
          "done"
            ? true
            : false,
      },
    }
  }

  return null
}

async function saveToThings(payload) {
  console.log(`🎉 Saving to Things..`)
  await open(payload, { background: true })
}

async function createThingsData(sprintId, items) {
  const things = [
    {
      type: "project",
      attributes: {
        area: `${process.env.THINGS_AREA}`,
        title: await getSprintName(sprintId),
        items: [],
      },
    },
  ]

  things[0].attributes.items = [...things[0].attributes.items, ...items]

  return things
}

function createThingsPayload(data) {
  let payload = encodeURIComponent(JSON.stringify(data))
  payload = process.env.THINGS_URL + payload

  return payload
}

// Handle Sprint ID argument. Return error if one isn't passed.
function getSprintId() {
  const args = process.argv.slice(2)
  const sprintId = args[0]

  if (sprintId === undefined) {
    console.error(`❗ Please provide a Sprint ID as the first argument.`)
    process.exit(1)
  }

  if (isNaN(sprintId)) {
    console.error(`❗ Sprint ID should be a number.`)
    process.exit(1)
  }

  return sprintId
}

async function init() {
  console.log(`🚀 Here we go..`)
  const sprintId = getSprintId()
  const data = await getSprintTasks(sprintId)
  const thingsData = await createThingsData(sprintId, data)
  const payload = createThingsPayload(thingsData)
  saveToThings(payload)
}

init()
