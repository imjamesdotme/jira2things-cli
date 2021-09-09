const { getSprintId } = require("./utils")
const { getSprintName, getSprintTasks } = require("./jira")
const {
  createThingsData,
  createThingsPayload,
  saveToThings,
} = require("./things")

async function init() {
  console.log(`🚀 Here we go..`)
  const sprintId = getSprintId()
  const sprintName = await getSprintName(sprintId)
  const data = await getSprintTasks(sprintId)
  const thingsData = await createThingsData(sprintName, data)
  const payload = createThingsPayload(thingsData)
  saveToThings(payload)
}

module.exports = {
  init,
}
