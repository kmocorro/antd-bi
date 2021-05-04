import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import { Typography, Cascader, Table, Button, message, Input, Image } from 'antd'
import { CSVLink, CSVDownload } from "react-csv"
import { DownloadOutlined } from '@ant-design/icons'
const { Title } = Typography
// fromweek":"2021-W2","toweek":"2021-W52","searchparam":"ALL","button":"ALL"

const group = [
  {value: 'ALL', label: 'All'},
  {value: 'Cluster 1 (Damage - NTM)', label: 'Cluster 1 (Damage - NTM)'},
  {value: 'Cluster 2 (NOXE - TOXE)', label: 'Cluster 2 (NOXE - TOXE)'},
  {value: 'Cluster 3 (Cleantex - PBA)', label: 'Cluster 3 (Cleantex - PBA)'},
  {value: 'Cluster 4 (LCM - Edgecoat)', label: 'Cluster 4 (LCM - Edgecoat)'},
  {value: 'Cluster 5 (Plating - Test)', label: 'Cluster 5 (Plating - Test)'},
  {value: 'Facilities - CDS', label: 'Facilities - CDS'},
  {value: 'Facilities - Electrical', label: 'Facilities - Electrical'},
  {value: 'Facilities - FMCS', label: 'Facilities - FMCS'},
  {value: 'Facilities - Gen. Exhaust', label: 'Facilities - Gen. Exhaust'},
  {value: 'Facilities - HVAC', label: 'Facilities - HVAC'},
  {value: 'Facilities - PCW', label: 'Facilities - PCW'},
  {value: 'Facilities - RODI', label: 'Facilities - RODI'},
  {value: 'Facilities - Scrubber', label: 'Facilities - Scrubber'},
  {value: 'Facilities - Waste Water', label: 'Facilities - Waste Water'},
  {value: 'HR - TOD (Training)', label: 'HR - TOD (Training)'},
  {value: 'HR - Services (Canteen Committee / Shuttle)', label: 'HR - Services (Canteen Committee / Shuttle)'},
  {value: 'SharePoint Dev', label: 'SharePoint Dev'},
  {value: 'Support - Finance', label: 'Support - Finance'},
  {value: 'Support - IE', label: 'Support - IE'},
  {value: 'Support - IT', label: 'Support - IT'},
  {value: 'Support - Logistics', label: 'Support - Logistics'},
  {value: 'Support - Planning', label: 'Support - Planning'},
  {value: 'Support - Purchasing', label: 'Support - Purchasing'},
  {value: 'Support - QA + Wet & Dry Lab', label: 'Support - QA + Wet & Dry Lab'},
  {value: 'Support - Reliability', label: 'Support - Reliability'},
  {value: 'Support - Yield', label: 'Support - Yield'},
]

const toWeek = [
  { key: 1, value: 'W2', label: 'W2', children: group},
  { key: 2, value: 'W3', label: 'W3', children: group},
  { key: 3, value: 'W4', label: 'W4', children: group},
  { key: 4, value: 'W5', label: 'W5', children: group},
  { key: 5, value: 'W6', label: 'W6', children: group},
  { key: 6, value: 'W7', label: 'W7', children: group},
  { key: 7, value: 'W8', label: 'W8', children: group},
  { key: 8, value: 'W9', label: 'W9', children: group},
  { key: 9, value: 'W10', label: 'W10', children: group},
  { key: 10, value: 'W11', label: 'W11', children: group},
  { key: 11, value: 'W12', label: 'W12', children: group},
  { key: 12, value: 'W13', label: 'W13', children: group},
  { key: 13, value: 'W14', label: 'W14', children: group},
  { key: 14, value: 'W15', label: 'W15', children: group},
  { key: 15, value: 'W16', label: 'W16', children: group},
  { key: 16, value: 'W17', label: 'W17', children: group},
  { key: 17, value: 'W18', label: 'W18', children: group},
  { key: 18, value: 'W19', label: 'W19', children: group},
  { key: 19, value: 'W20', label: 'W20', children: group},
  { key: 20, value: 'W21', label: 'W21', children: group},
  { key: 21, value: 'W22', label: 'W22', children: group},
  { key: 22, value: 'W23', label: 'W23', children: group},
  { key: 23, value: 'W24', label: 'W24', children: group},
  { key: 24, value: 'W25', label: 'W25', children: group},
  { key: 25, value: 'W26', label: 'W26', children: group},
  { key: 26, value: 'W27', label: 'W27', children: group},
  { key: 27, value: 'W28', label: 'W28', children: group},
  { key: 28, value: 'W29', label: 'W29', children: group},
  { key: 29, value: 'W30', label: 'W30', children: group},
  { key: 30, value: 'W31', label: 'W31', children: group},
  { key: 31, value: 'W32', label: 'W32', children: group},
  { key: 32, value: 'W33', label: 'W33', children: group},
  { key: 33, value: 'W34', label: 'W34', children: group},
  { key: 34, value: 'W35', label: 'W35', children: group},
  { key: 35, value: 'W36', label: 'W36', children: group},
  { key: 36, value: 'W37', label: 'W37', children: group},
  { key: 37, value: 'W38', label: 'W38', children: group},
  { key: 38, value: 'W39', label: 'W39', children: group},
  { key: 39, value: 'W40', label: 'W40', children: group},
  { key: 40, value: 'W41', label: 'W41', children: group},
  { key: 41, value: 'W41', label: 'W42', children: group},
  { key: 42, value: 'W43', label: 'W43', children: group},
  { key: 43, value: 'W44', label: 'W44', children: group},
  { key: 44, value: 'W45', label: 'W45', children: group},
  { key: 45, value: 'W46', label: 'W46', children: group},
  { key: 46, value: 'W47', label: 'W47', children: group},
  { key: 47, value: 'W48', label: 'W48', children: group},
  { key: 48, value: 'W49', label: 'W49', children: group},
  { key: 49, value: 'W50', label: 'W50', children: group},
  { key: 50, value: 'W51', label: 'W51', children: group},
  { key: 51, value: 'W52', label: 'W52', children: group},
  { key: 52, value: 'W53', label: 'W53', children: group},
]

const fromWeek = [
  { key: 0, value: 'W1', label: 'W1', children: toWeek},
  { key: 1, value: 'W2', label: 'W2', children: toWeek},
  { key: 2, value: 'W3', label: 'W3', children: toWeek},
  { key: 3, value: 'W4', label: 'W4', children: toWeek},
  { key: 4, value: 'W5', label: 'W5', children: toWeek},
  { key: 5, value: 'W6', label: 'W6', children: toWeek},
  { key: 6, value: 'W7', label: 'W7', children: toWeek},
  { key: 7, value: 'W8', label: 'W8', children: toWeek},
  { key: 8, value: 'W9', label: 'W9', children: toWeek},
  { key: 9, value: 'W10', label: 'W10', children: toWeek},
  { key: 10, value: 'W11', label: 'W11', children: toWeek},
  { key: 11, value: 'W12', label: 'W12', children: toWeek},
  { key: 12, value: 'W13', label: 'W13', children: toWeek},
  { key: 13, value: 'W14', label: 'W14', children: toWeek},
  { key: 14, value: 'W15', label: 'W15', children: toWeek},
  { key: 15, value: 'W16', label: 'W16', children: toWeek},
  { key: 16, value: 'W17', label: 'W17', children: toWeek},
  { key: 17, value: 'W18', label: 'W18', children: toWeek},
  { key: 18, value: 'W19', label: 'W19', children: toWeek},
  { key: 19, value: 'W20', label: 'W20', children: toWeek},
  { key: 20, value: 'W21', label: 'W21', children: toWeek},
  { key: 21, value: 'W22', label: 'W22', children: toWeek},
  { key: 22, value: 'W23', label: 'W23', children: toWeek},
  { key: 23, value: 'W24', label: 'W24', children: toWeek},
  { key: 24, value: 'W25', label: 'W25', children: toWeek},
  { key: 25, value: 'W26', label: 'W26', children: toWeek},
  { key: 26, value: 'W27', label: 'W27', children: toWeek},
  { key: 27, value: 'W28', label: 'W28', children: toWeek},
  { key: 28, value: 'W29', label: 'W29', children: toWeek},
  { key: 29, value: 'W30', label: 'W30', children: toWeek},
  { key: 30, value: 'W31', label: 'W31', children: toWeek},
  { key: 31, value: 'W32', label: 'W32', children: toWeek},
  { key: 32, value: 'W33', label: 'W33', children: toWeek},
  { key: 33, value: 'W34', label: 'W34', children: toWeek},
  { key: 34, value: 'W35', label: 'W35', children: toWeek},
  { key: 35, value: 'W36', label: 'W36', children: toWeek},
  { key: 36, value: 'W37', label: 'W37', children: toWeek},
  { key: 37, value: 'W38', label: 'W38', children: toWeek},
  { key: 38, value: 'W39', label: 'W39', children: toWeek},
  { key: 39, value: 'W40', label: 'W40', children: toWeek},
  { key: 40, value: 'W41', label: 'W41', children: toWeek},
  { key: 41, value: 'W41', label: 'W42', children: toWeek},
  { key: 42, value: 'W43', label: 'W43', children: toWeek},
  { key: 43, value: 'W44', label: 'W44', children: toWeek},
  { key: 44, value: 'W45', label: 'W45', children: toWeek},
  { key: 45, value: 'W46', label: 'W46', children: toWeek},
  { key: 46, value: 'W47', label: 'W47', children: toWeek},
  { key: 47, value: 'W48', label: 'W48', children: toWeek},
  { key: 48, value: 'W49', label: 'W49', children: toWeek},
  { key: 49, value: 'W50', label: 'W50', children: toWeek},
  { key: 50, value: 'W51', label: 'W51', children: toWeek},
  { key: 51, value: 'W52', label: 'W52', children: toWeek},
  { key: 52, value: 'W53', label: 'W53', children: toWeek},
]

const whatYear = [
  {value: '2020', label: '2020', children: fromWeek},
  {value: '2021', label: '2021', children: fromWeek},
  {value: '2022', label: '2022', children: fromWeek},
  {value: '2023', label: '2023', children: fromWeek},
  {value: '2024', label: '2024', children: fromWeek},
  {value: '2025', label: '2025', children: fromWeek},
  {value: '2026', label: '2026', children: fromWeek},
  {value: '2027', label: '2027', children: fromWeek},
  {value: '2028', label: '2028', children: fromWeek},
  {value: '2029', label: '2029', children: fromWeek},
  {value: '2030', label: '2030', children: fromWeek},
]

const options = whatYear;

// DATA
/**
 * {
  "bi_number": 17,
  "uuid": "428592e4-000a-47ab-b471-adbbeca063cb",
  "bi_id": "FAB4-4920-17",
  "current": "submitted",
  "title": "acrylic cover for EMO in BSG 8 ",
  "creator": "Blanca Lizette Rellermo",
  "sps_team": "Cluster 1 (Damage - NTM)",
  "shift": "Z",
  "proposal": "put a acrylic cover for unloader automation EMO. to avoid bumping the EMO, and to avoid shutting down of the tool. ",
  "current_practice": "everytime we use the back part of bsg 8 for pathway going to loader area, sometimes we accidentally bump into the EMO in the unloader automation that can cause of shutting down of the tool.",
  "benefactor": "Cluster 1 (Damage - NTM)",
  "initial_impact": "Outs / OEE / UPH",
  "submission_week": "2020-49",
  "submission_date": "2020-12-04 03:26:27",
  "fa": "for assessment",
  "fa_assessor": "37059",
  "fa_date": null,
  "fa_weekdate": null,
  "ra": null,
  "risk_assessor": null,
  "ra_date": null,
  "ra_weekdate": null,
  "action": null,
  "action_owner": null,
  "action_date": null,
  "action_weekdate": null,
  "implementation": null,
  "implementor": null,
  "implementation_date": null,
  "implementation_weekdate": null
  }
 */

const columns = [
  {
    title: 'Work Week',
    dataIndex: 'submission_week',
  },
  {
    title: 'Year',
    dataIndex: 'submission_year',
  },
  {
    title: 'BINo',
    dataIndex: 'bi_id',
  },
  {
    title: 'Employee no.',
    dataIndex: 'creator',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Before Image',
    key: 'before_imgPath',
    render: (text, img) => (
      <Image src={`http://10.3.10.209:4881/images/${img.before_imgPath}`} />
    ),
  },
  {
    title: 'After Image',
    key: 'before_imgPath',
    render: (text, img) => (
      img.after_imgPath ? 
      <Image src={`http://10.3.10.209:4881/images/${img.after_imgPath}`} />
      : <></>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'current',
  },
  {
    title: 'Title',
    dataIndex: 'title',
  },
  {
    title: 'Impact',
    dataIndex: 'initial_impact',
  },
  {
    title: 'Current Practice',
    dataIndex: 'current_practice',
  },
  {
    title: 'Proposal',
    dataIndex: 'proposal',
  },
  {
    title: 'SPS Team',
    dataIndex: 'sps_team',
  },
  {
    title: 'Beneficiary',
    dataIndex: 'benefactor',
  },
];

const { Search } = Input;

function onChangeTable(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}


const SearchPage = () => {

  const [ searchResult, setSearchResult ] = useState([])
  const [ filename, setFilename ] = useState('')
  console.log(searchResult)
 
  function getQuarter(date) {
    var dt = new Date(date)
    var month = dt.getMonth() + 1;
    return (Math.ceil(month / 3));
  }

  function getWeek(date) {
    var dt = new Date(date);
    var tdt = new Date(dt.valueOf());
    var dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
      return 1 + Math.ceil((firstThursday - tdt) / 604800000);
  }

  async function onChange(value) {
    console.log(value);

    if(value.length > 0){
      setFilename(`${value[0]}_${value[1]}_${value[2]}`)
      let body_fields = JSON.stringify({
        fromweek: `${value[0]}-${value[1]}`,
        toweek: `${value[0]}-${value[2]}`,
        searchparam: value[3],
        button: value[3] === 'ALL' ? 'ALL' : 'TEAM'
      })
      console.log(body_fields)
      
      let response = await fetch(`http://10.3.10.209:4547/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: body_fields
      })
  
      if(response.status === 200){
        // setSearchResult(await response.json())
        let initial_result = await response.json();

        const gg = async () => {
          let go = await initial_result.map(data => (
            { quarter: `Q${getQuarter(data.submission_date)}`, work_week: `WW${getWeek(data.submission_date)}`, year: data.submission_week.substring(0, 4), ...data}
          ))
          setSearchResult(await go)
        }

        gg();

      }
      
    }

  }

  // Quarter	WorkWeek	Year	MemberName	MemberDept	Shifts	BINo	Title	CurrentProblem	Proposal	AreaOfApplication	InitialImpact	Team	Supervisor	BICategory	ImplementationCost	CompletionDate	Completion Work Week	ApprovedDate	Approved Work Week	Disapproved Date	Disapproved Work Week	ActionOwner	ActionOwnerDept	BIStatus	BeforePic	AfterPic	FinalImpact	CostSavings	ImplementationDate	Implementation Work Week	SharetoFAB3	YokotenRecipient	%YokotenCompletion	ActualImplementor	Modified	Modified By	TransferSupervisor	SubmissionDate	Created By	Item Type	Path

  // bi_number	uuid	bi_id	current	title	creator	sps_team	shift	proposal	current_practice	benefactor	initial_impact	submission_week	submission_date	fa	fa_assessor	fa_date	fa_weekdate	ra	risk_assessor	ra_date	ra_weekdate	action	action_owner	action_date	action_weekdate	implementation	implementor	implementation_date	implementation_weekdate	quarter	work_week


  const headers = [
    {label: 'Quarter', key: 'quarter'},
    {label: 'WorkWeek', key: 'work_week'},
    {label: 'Year', key: 'year'},
    {label: 'MemberName', key: 'creator'},
    {label: 'Shift', key: 'shift'},
    {label: 'BINo', key: 'bi_number'},
    {label: 'Title', key: 'title'},
    {label: 'CurrentProblem', key: 'current_practice'},
    {label: 'Proposal', key: 'proposal'},
    {label: 'AreaOfApplication', key: 'benefactor'},
    {label: 'InitialImpact', key: 'initial_impact'},
    {label: 'Team', key: 'sps_team'},
  ]


  useEffect(() => {
    if(searchResult.length > 0){
      message.success(`${searchResult.length} results found. Table has been updated!`)
    }
  }, [searchResult])

  const onSearch = async (value) => {
    console.log(value)

    let body_fields = JSON.stringify({
      search: value
    })

    let response = await fetch(`/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: body_fields
    })

    if(response.status === 200){
      setSearchResult(await response.json())
    }
  }

  return (
    <Layout name={'Public'}>
      <div>
        <Typography>
          <Title level={4}>Search</Title>
        </Typography>
        <Search placeholder="Search anything..." onSearch={onSearch} style={{width: '30%', marginBottom: 24}} />
        {
          searchResult.length > 0 ? (

            <Button type="primary" style={{float: 'right'}}><CSVLink data={searchResult} filename={`Project_BI_${filename}.csv`}><DownloadOutlined /> Download CSV</CSVLink></Button>
          ):(
            <Button type="primary" disabled  style={{float: 'right'}}><DownloadOutlined /> Download CSV</Button>
          )
        }
        <Table columns={columns} dataSource={searchResult} onChange={onChangeTable} size="small" scroll={{ x: 1800 }} />
      </div>
    </Layout>
  )
}

export default SearchPage