const db = require('../../lib/db')
const escape = require('sql-template-strings')

module.exports = async (req, res) => {
  const fields = req.body

  console.log(fields)
  
  // remove the escape
  const query =`
    SELECT 
    a.submission_week,
    a.submission_year,
    a.bi_number, 
    a.bi_id, a.title, a.uuid, a.creator, 
    c.name, c.email, c.sps_team, c.shift, 
    b.activeStep, 
    b.current,
    a.proposal, a.current_practice, a.benefactor, a.initial_impact, a.initial_status, a.status_date, a.before_imgPath, a.after_imgPath,
    b.fa, b.fa_approver, b.fa_date, b.ra, b.risk_assessor, b.ra_date, b.with_deniedAction, b.action, b.action_owner, b.action_date, b.implementation, b.implementor, b.implementation_date
    FROM BI a JOIN status_history b ON a.bi_number = b.bi_number JOIN USER c ON c.employee_number = a.creator
    WHERE 
    a.creator LIKE '%${fields.search}%' 
    OR a.bi_id LIKE '%${fields.search}%' 
    OR a.title LIKE '%${fields.search}%' 
    OR c.name LIKE '%${fields.search}%' 
    OR c.sps_team LIKE '%${fields.search}%'
    OR b.fa LIKE '%${fields.search}%' 
    OR b.ra LIKE '%${fields.search}%' 
    OR b.action LIKE '%${fields.search}%' 
    OR b.implementation LIKE '%${fields.search}%'
  `

  const search_bi = await db.query(query)

  res.status(200).json(search_bi)

}