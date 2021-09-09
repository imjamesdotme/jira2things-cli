const open = require("open")

async function createThingsData(sprintName, items) {
  const things = [
    {
      type: "project",
      attributes: {
        area: `${process.env.THINGS_AREA}`,
        title: `${sprintName}`,
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

async function saveToThings(payload) {
  console.log(`🎉 Saving to Things..`)
  await open(payload, { background: true })
}

module.exports = {
  createThingsData,
  createThingsPayload,
  saveToThings,
}
