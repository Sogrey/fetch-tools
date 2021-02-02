const fetch = require('node-fetch');

console.log(fetch);

async function loadFile(url) {
    var response = await fetch(url);
    // for (var [key, value] of response.headers) {
    //     console.log(`${key} : ${value}`);
    // }
    if (response.status >= 200 && response.status < 300) {
        // response.text()：得到文本字符串。
        // response.json()：得到 JSON 对象。
        // response.blob()：得到二进制 Blob 对象。
        // response.formData()：得到 FormData 表单对象。
        // response.arrayBuffer()：得到二进制 ArrayBuffer 对象。
        return await response.text();
    } else {
        throw new Error(response.statusText);
    }
}

function parseData(text) {
    return JSON.parse(text);
}

async function loadData(info) {
    const text = await loadFile(info.url);
    info.file = parseData(text);
    console.dir(info);
}

async function loadAll() {
    const fileInfos = [{
            name: 'api-github',
            url: 'https://api.github.com/'
        },
        {
            name: 'sogrey',
            url: 'https://api.github.com/users/sogrey'
        },
        {
            name: 'followers',
            url: 'https://api.github.com/users/sogrey/followers'
        },
        {
            name: 'repos',
            url: 'https://api.github.com/users/sogrey/repos'
        },
        {
            name: 'orgs',
            url: 'https://api.github.com/users/sogrey/orgs'
        },
        {
            name: 'starred',
            url: 'https://api.github.com/users/sogrey/starred'
        },
        {
            name: 'gists',
            url: 'https://api.github.com/users/sogrey/gists'
        },
        {
            name: 'following',
            url: 'https://api.github.com/users/sogrey/following'
        },
    ];

    await Promise.all(fileInfos.map(loadData));

}
loadAll();