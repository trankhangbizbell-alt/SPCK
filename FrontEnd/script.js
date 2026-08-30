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

    topNewUrl = url + "&size=9";
    await CallApi(topNewUrl);
}

document.addEventListener("click", async function(e) {
    if(e.target && e.target.id === "btn-logout") {
        localStorage.removeItem("userLoggedIn");
        alert("You have been logged out. Redirecting to homepage...");
        window.location.href = "./FrontEnd/signin.html";
    }

    if(e.target && e.target.id === "btn-load") {
      topNewUrl = url + "&size=9" + nextPage;
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
          <div class="card col-lg-3 col-md-4 col-sm-12 m-2">
          <img src="${data.results[i].image_url}" class="card-img-top" alt="..." />
          <div class="card-body">
            <p class="card-text">
              ${data.results[i].title}
            </p>
            <a class="btn btn-primary" href="./details/detail.html">Chi tiết</a>
          </div>
        </div>
        `;
      }
      document.getElementById("top-news").innerHTML +=  newsHtml;  
      nextPage = "&page="+data.nextPage;
    })

}