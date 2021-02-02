//FetchUtils
// 加密前需要进行 Babel编译，可以在线编译 https://www.babeljs.cn/repl

async function loadFile(fileInfo) {
  if (!fileInfo.response) fileInfo.response = 'fetch';
  if (fileInfo.response == 'fetch' && window.fetch) { // 支持 fetch

    var params;
    var contentType = 'application/json';
    if (fileInfo.params) {

      if (fileInfo.params.type == "Json") {
        params = JSON.stringify(fileInfo.params.data);
        contentType = 'application/json';
      } else {
        params = fileInfo.params.data;
        // contentType = 'text/plain';
      }
    }

    var option = {
      // body: params, //JSON.stringify(data), // must match 'Content-Type' header
      cache: 'force-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // - default：默认值，先在缓存里面寻找匹配的请求。
      // - no-store：直接请求远程服务器，并且不更新缓存。
      // - reload：直接请求远程服务器，并且更新缓存。
      // - no-cache：将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存。
      // - force-cache：缓存优先，只有不存在缓存的情况下，才请求远程服务器。
      // - only-if-cached：只检查缓存，如果缓存里面不存在，将返回504错误。
      credentials: 'include', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': contentType
      },
      method: fileInfo.method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
      keepalive: false, //属性用于页面卸载时，告诉浏览器在后台是否保持连接，继续发送数据
    };

    if (fileInfo.method != "GET") {
      option.body = params;
    }

    var response = await fetch(fileInfo.url, option);
    if (response.status >= 200 && response.status < 300) {
      switch (fileInfo.type) {
        case "Text": //得到文本字符串。
          return await response.text();
        case "Json": //得到 JSON 对象。
          return await response.json();
        case "Blob": //得到二进制 Blob 对象。
          return await response.blob();
        case "FormData": //得到 FormData 表单对象。
          return await response.formData();
        case "ArrayBuffer": //得到二进制 ArrayBuffer 对象。
          return await response.arrayBuffer();

        default:
          break;
      }
      return await response.arrayBuffer();
    } else {
      throw new Error(response.statusText);
    }
  } else { //兼容不支持fetch
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new window.XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject; // 兼容IE
      }

      requestObj.open(fileInfo.method, fileInfo.url, true);
      requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      switch (fileInfo.type) {
        case "Text": //得到文本字符串。
          requestObj.responseType = 'text';
          break;
        case "Json": //得到 JSON 对象。
          requestObj.responseType = 'json';
          break;
        case "Blob": //得到二进制 Blob 对象。
          requestObj.responseType = 'blob';
          break;
          // case "FormData": //得到 FormData 表单对象。
          // requestObj.responseType = 'text';break;
        case "ArrayBuffer": //得到二进制 ArrayBuffer 对象。
          requestObj.responseType = 'arraybuffer';
          break;

        default:
          break;
      }

      var params;
      if (fileInfo.params) {
        params = fileInfo.params.data;
        if (fileInfo.params.type == "Json") {
          params = JSON.stringify(fileInfo.params.data)
        }
      }
      requestObj.send(params);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response;
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }

}
async function loadData(fileInfo) {
  var data = await loadFile(fileInfo);
  fileInfo.data = data;

  if (fileInfo.type == 'Text') {
    fileInfo.callback(fileInfo.tag, fileInfo.data);
    return;
  }
  if (fileInfo.type == 'Json') {
    fileInfo.data = JSON.parse(fileInfo.data);
    fileInfo.callback(fileInfo.tag, fileInfo.data);
    return;
  }
  fileInfo.callback(fileInfo.tag, fileInfo.data);
}

async function loadAll(files, tag) {

  if (!files) return;

  if (!Array.isArray(files)) {
    files = [files];
  }

  files.map(function (item) {
    item.tag = tag
  });

  await Promise.all(files.map(loadData));

}
