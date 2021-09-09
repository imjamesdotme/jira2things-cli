const axios = require("axios")

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

async function handleGetRequest(url) {
  const OPTIONS = {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${process.env.JIRA_AUTH}`,
    },
  }

  try {
    const request = await axios.get(url, OPTIONS)
    return request.data
  } catch (error) {
    throw new Error(`❗ ${error.message}`)
  }
}

module.exports = {
  getSprintId,
  handleGetRequest,
}
