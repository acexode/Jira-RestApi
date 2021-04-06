const axios = require('axios').default
const BaseUrl = 'https://herocoders.atlassian.net/rest/api/3/';
const componentsUrl = BaseUrl  + 'project/IC/components';
const eq = encodeURI('project = IC AND component = ').replace(/=/g, '%3D')
var util = require('util');
const fs = require('fs')
const JQL = encodeURI(BaseUrl  + 'search?jql=') + eq;



/**
 * fetch Issue Checklist
 */
const fetchIssueChecklist =  async() =>{
    try {
        const res = await axios.get(componentsUrl)
        if(res.data.length){
            const data = res.data.filter(obj => !obj.hasOwnProperty('lead'))
            fetchComponentWithNoLead(data)
        }else{
            throw new Error("")
        }
    } catch (err) {
        console.error(err);
    }
}
const fetchComponentWithNoLead = async (data) =>{
    try {
        if(data.length > 0){
            const axiosReq = data.map(obj => {
                const name = obj.name.includes(" ") ? JSON.stringify(obj.name) : obj.name
                return axios.get(JQL + name)
            })
            const allIssues = []
            const all = await axios.all(axiosReq)
            console.log(all.length)
            all.forEach((iss, idx) => {
                const {total} = iss.data
                allIssues.push({
                    component_Id: parseInt(data[idx].id),
                    component_Name: data[idx].name,
                    num_Issues: total,
                })
            });
            writeTofile(allIssues)
            console.table(allIssues)
        }else{
            throw new Error("No components without lead ")
        }
    } catch (error) {
        console.log(error)
    }
}

const writeTofile = (obj) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(obj))
      } catch (err) {
        console.error(err)
    }
}

module.exports = {fetchIssueChecklist}