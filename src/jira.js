const { handleGetRequest } = require("./utils")

async function getSprintName(sprintId) {
  const URL = `${process.env.JIRA_SPRINT_URL}${sprintId}`
  const data = await handleGetRequest(URL)

  return data.name
}

async function getSprintTasks(sprintId) {
  const URL = `${process.env.JIRA_SPRINT_URL}${sprintId}/issue`
  const data = await handleGetRequest(URL)

  let stories = []

  for (const issue of data.issues) {
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

  const URL = `${process.env.JIRA_ISSUE_URL}${storyKey}`
  const data = await handleGetRequest(URL)

  const tasks = []

  // If a story has no subtasks, nothing more is required.
  if (!data.fields.subtasks.length) {
    console.log(`❎  No subtasks attached to story: ${storyKey}`)
    return tasks
  }

  for (const task of data.fields.subtasks) {
    const taskData = await getTask(task.key)

    if (taskData !== null) {
      tasks.push(taskData)
    }
  }

  console.log(`⛵ Total subtasks for ${storyKey}: ${tasks.length}`)
  return tasks
}

async function getTask(taskKey) {
  console.log(`🏃‍♂️ Getting data for task ${taskKey}`)

  const URL = `${process.env.JIRA_ISSUE_URL}${taskKey}`
  const data = await handleGetRequest(URL)

  if (data.fields?.assignee?.emailAddress === process.env.JIRA_EMAIL_ADDRESS) {
    console.log(`🔎 Found a task for this user`)
    return {
      type: "to-do",
      attributes: {
        title: data.fields.summary,
        notes: data.fields.description || "",
        completed:
          data.fields.status.statusCategory.name.toLowerCase() === "done"
            ? true
            : false,
      },
    }
  }

  return null
}

module.exports = {
  getSprintName,
  getSprintTasks,
  getSubtasks,
  getTask,
}
