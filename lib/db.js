const mysql = require('serverless-mysql')

const db = mysql({
  config: {
    host: '10.3.10.20',
    database: 'BrightIdea',
    user: 'biselector',
    password: 'biselectorP4ss!',
  },
})

exports.query = async (query) => {
  try {
    const results = await db.query(query)
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}
