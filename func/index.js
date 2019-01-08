const config = require('./config.json');
const secrets = require('./secrets.json');
const axios = require("axios");

(async function() {

    var SOAnswers = await getStackOverflowAnswers();
    console.log(SOAnswers);

    var SOQuestions = await getStackOverflowQuestions();
    console.log(SOQuestions);

    var githubRepos = await getGitHubRepos();
    console.log(githubRepos);

    var blogPosts = await getBlogPosts();
    console.log(blogPosts);

    var fiddles = await getFiddles();
    console.log(fiddles);
    

})()

async function getFiddles() {
    var fiddleName = "KyleMit"
    var fiddles = [];

    do {
        var params = { 
            limit: 99,
            start: fiddles.length // zero based index
         }
        var url = `https://jsfiddle.net/api/user/${fiddleName}/demo/list.json?${getParams(params)}`
    
        response = await getData(url)

        fiddles.push(...response)

    } while (response.length) // keep going until there isn't any data left
   
    return fiddles
}

async function getBlogPosts() {
    var blogId = "8252867149515968674"
    var params = { 
        maxResults: 99,
        key: secrets.GoogleApiKey
     }
    var url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?${getParams(params)}`

    blogPosts = await getData(url)

    return blogPosts.items
}

async function getGitHubRepos() {
    var userId = "KyleMit"
    var params = { per_page: 999 }

    var url = `https://api.github.com/users/${userId}/repos?${getParams(params)}`
    repos = await getData(url)
    
    for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        
        var readMeUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`
        readme = await getData(readMeUrl)
        repo.readme = readme;
    }

    return repos
}

async function getStackOverflowAnswers() {
    var userId = "1366033",
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

async function getStackOverflowQuestions() {
    var userId = "1366033",
        answers = [],
        response = {};

    do {
        var params = {
            page: response.page ? response.page + 1 : 1,
            pagesize: 99,
            order: "desc",
            sort: "activity",
            site: "stackoverflow",
            filter: "!gB8kbaBHiaDl5hSyghdoeUS7Ql5WWK*mc*r",
        }
    
        var url = `https://api.stackexchange.com/2.2/users/${userId}/questions?${getParams(params)}`
 
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
        console.log(`Error calling ${url} \n`,error);

        return {}
      }
}