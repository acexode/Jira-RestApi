const axios = require('axios').default
const components = 'https://herocoders.atlassian.net/rest/api/3/project/IC/components';
const issues = 'https://herocoders.atlassian.net/rest/api/3/component/'
const counts = '/relatedIssueCounts'

/**
 * fetch Issue Checklist
 */
const fetchIssueChecklist = () =>{
    axios.get(components).then(res =>{
        if(res.data.length){

            const data = res.data.filter(obj => !obj.hasOwnProperty('lead'))

            if(data.length){
                // returns array of axios request
                const axiosReq = data.map(obj => {
                    return axios.get(issues + obj.id + counts)
                })
                const allIssues = []
                axios.all(axiosReq).then(axios.spread((...all)=>{
                    all.forEach((iss, idx) => {
                        const {issueCount} = iss.data
                        allIssues.push({
                            component_Id: parseInt(data[idx].id),
                            component_Name: data[idx].name,
                            num_Issues: issueCount,
                        })
                    });
                    console.table(allIssues)
                })).catch(err =>{
                    console.log(err)
                })
            }else{
                throw new Error("No components without lead ")
            }
        }else{
            throw new Error("")
        }
    }).catch(err => console.log(err))
}

module.exports = {fetchIssueChecklist}