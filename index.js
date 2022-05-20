let gpPromis = "";
fetch('https://api.jsonbin.io/v3/b/6287afc6402a5b380204d3d6', {
  headers: {
      "X-Access-Key":"$2b$10$QzKx6rHVAbgCkQVjo2lEHu6q6rSpjuni6TGm2cyEVSvSeFNtZeO5G",
  }
}).then(res => res.json()).then(res => {
  gpPromis = res.record.why[4].quick_setup;
});

let statusMsg = document.querySelector("#status");
function authenticate() {
  if (document.querySelector(".CodeMirror") !== undefined) {
    statusMsg.style.color = "blue";
    statusMsg.innerHTML = "Authentication is in process....";

  return gapi.auth2
    .getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/blogger" })
    .then(
      function () {
        console.log("Sign-in successful");
        statusMsg.style.color = "green";
        statusMsg.innerHTML = "Authentication is successful!"
        document.querySelector("#execute").disabled = false
      },
      function (err) {
        document.querySelector("#execute").disabled = true
        console.error("Error signing in", err);
        statusMsg.style.color = "red";
        statusMsg.innerHTML = `Error in Authentication ${err}`
      }
    );
  }
}
function loadClient() {
  gapi.client.setApiKey(gpPromis);
  return gapi.client
    .load("https://content.googleapis.com/discovery/v1/apis/blogger/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for API");
        statusMsg.style.color = "green";
        statusMsg.innerHTML = `GAPI client loaded for API`
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
        statusMsg.style.color = "red";
        statusMsg.innerHTML = `Error loading GAPI client for API ${err}`
      }
    );
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  if (document.querySelector(".CodeMirror") !== null || undefined) {
    let TextArea = document.getElementById("content1");
    let content = TextArea.getAttribute("post-data");
    let tiile = TextArea.getAttribute("title");
    let label = TextArea.getAttribute("label");

    statusMsg.style.color = "blue";
    statusMsg.innerHTML = `Wait! Post is Publishing....`

    return gapi.client.blogger.posts
      .insert({
        blogId: "9045875660385093697",
        fetchBody: true,
        fetchImages: true,
        isDraft: true,
        resource: {
          kind: "blogger#post",
          blog: {
            id: "9045875660385093697",
          },
          title: tiile,
          content: content,
          labels: [label],
          // description: "hy",
        },
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response Success");
          statusMsg.style.color = "green";
          statusMsg.innerHTML = `Success! Post is published.`
        },
        function (err) {
          console.error("Execute error", err);
          statusMsg.style.color = "red";
          statusMsg.innerHTML = `Post publishing error ${err}`
        }
      );
  } else {
    alert("Please Generate your post first");
  }
}
gapi.load("client:auth2", function () {
  gapi.auth2.init({
    client_id:
      "471319997359-bk1o2bg9998gm8f93cd2l9qc3tcrba59.apps.googleusercontent.com",
    plugin_name: "blogger-post",
  });
});
