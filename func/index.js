const config = require('./config.json');
const secrets = require('./secrets.json');
const axios = require("axios");

(async function() {

    var SOAnswers = await getStackOverflowAnswers()
    console.log(SOAnswers);

})()

async function getStackOverflowAnswers() {
    var userId = 1366033,
        answers = [],
        response = {};

    do {
        var params = {
            page: response.page ? response.page + 1 : 1,
            pagesize: 99,
            order: "desc",
            sort: "activity",
            site: "stackoverflow",
            filter: "!Fcb(61J.xH9mBNKQZFc1o1euO*",
        }
    
        var url = `https://api.stackexchange.com/2.2/users/${userId}/answers?${getParams(params)}`
 
        response = await getData(url)
        answers.push(...response.items)
    }
    while (response.has_more);

    return answers
}

function getParams(params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
    return query
}
async function getData(url) {
    console.log(`Fetching data from: ${url}`)
    try {
        const response = await axios.get(url);
        const data = response.data;

        return data;

      } catch (error) {
        console.log(error);

        return {}
      }
}