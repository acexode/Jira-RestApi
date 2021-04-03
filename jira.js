const axios = require('axios').default
const BaseUrl = 'https://herocoders.atlassian.net/rest/api/3/';
const componentsUrl = BaseUrl  + 'project/IC/components';
const eq = encodeURI('project = IC AND component = ').replace(/=/g, '%3D')

const JQL = encodeURI(BaseUrl  + 'search?jql=') + eq;



/**
 * fetch Issue Checklist
 */
const fetchIssueChecklist = () =>{
    axios.get(componentsUrl).then(res =>{
        if(res.data.length){

            const data = res.data.filter(obj => !obj.hasOwnProperty('lead'))

            if(data.length){
                // returns array of axios request
                const axiosReq = data.map(obj => {
                    const name = obj.name.includes(" ") ? JSON.stringify(obj.name) : obj.name
                    return axios.get(JQL + name)
                })
                const allIssues = []
                axios.all(axiosReq).then(axios.spread((...all)=>{
                    all.forEach((iss, idx) => {
                        const {total} = iss.data
                        allIssues.push({
                            component_Id: parseInt(data[idx].id),
                            component_Name: data[idx].name,
                            num_Issues: total,
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
    }).catch(err => console.log('err'))
}

module.exports = {fetchIssueChecklist}