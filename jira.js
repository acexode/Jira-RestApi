const axios = require('axios').default
const components = 'https://herocoders.atlassian.net/rest/api/3/project/IC/components';
const issues = 'https://herocoders.atlassian.net/rest/api/3/component/'
const counts = '/relatedIssueCounts'


const fetchIssueChecklist = () =>{
    axios.get(components).then(res =>{
        const data = res.data.filter(obj => !obj.hasOwnProperty('lead'))

        if(data.length){
            const axiosReq = data.map(obj => {
                return axios.get(issues + obj.id + counts)
            })
            const allIssues = []
            axios.all(axiosReq).then(axios.spread((...all)=>{
                all.forEach((iss, idx) => {
                    const {issueCount} = iss.data
                    allIssues.push({
                        component_Id: data[idx].id,
                        num_Issues: issueCount,
                    })
                });
                console.table(allIssues)
            }))
        }
    })
}

module.exports = {fetchIssueChecklist}