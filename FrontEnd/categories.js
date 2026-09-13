var url = "https://newsdata.io/api/1/latest?apikey=pub_4a96eb26e93c4500a650c327765eda16&language=vi"
var nextPage = ""

window.onload = async function() {
    var userLoggedIn = localStorage.getItem("userLoggedIn");
    if(userLoggedIn != null) {
      userLoggedIn = JSON.parse(userLoggedIn);
      document.getElementById("user-infor").innerHTML = `
          <div class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ${userLoggedIn.username}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#" id="btn-logout">Đăng xuất</a></li>
              </ul>
            </div>
      `;
    }
    var queryString = window.location.search;
    var urlParam = new URLSearchParams(queryString);
    var category = urlParam.get("caterogy");

    if(category == null)
        window.location = "/"
    else 
    {
      url += "&category=" + category + "&size=10"
      await CallApi(url)
    }

}

document.addEventListener("click", async function(e) {
    if(e.target && e.target.id === "btn-logout") {
        localStorage.removeItem("userLoggedIn");
        alert("You have been logged out. Redirecting to homepage...");
        window.location.href = "./login.html";
    }

    if(e.target && e.target.id === "btn-load") {
      topNewUrl = url + nextPage;
      await CallApi(topNewUrl);
    }
})


async function CallApi(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      var newsHtml = "";
      for(var i = 0; i < data.results.length; i++) {
        newsHtml += `
          <div class="card mb-3">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${data.results[i].image_url}" class="img-fluid rounded-start" alt="..." />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${data.results[i].title}</h5>
                  <p class="card-text">
                    ${data.results[i].description}
                  </p>
                  <p class="card-text">
                    <small class="text-muted">${data.results[i].pubDate}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      document.getElementById("top-news").innerHTML +=  newsHtml;  
      nextPage = "&page="+data.nextPage;
    })

}