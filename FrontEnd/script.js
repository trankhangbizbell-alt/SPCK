var PAGE_SIZE = 9; // Số bài viết tải mỗi lần
var lastDoc = null; // Bài viết cuối của lần tải trước, dùng để tải thêm

window.onload = function () {
  showUserNav(); // Hiện nút đăng nhập / tên người dùng
  loadPosts();
};

// ====== LẤY BÀI VIẾT TỪ FIRESTORE ======
function loadPosts() {
  var query = db.collection("posts").orderBy("createdAt", "desc").limit(PAGE_SIZE);

  // Nếu đã tải trước đó thì lấy tiếp từ bài cuối cùng
  if (lastDoc != null) {
    query = query.startAfter(lastDoc);
  }

  query
    .get()
    .then(function (querySnapshot) {
      if (querySnapshot.empty) {
        document.getElementById("btn-load").style.display = "none";

        if (lastDoc == null) {
          document.getElementById("top-news").innerHTML =
            "<p>Chưa có bài viết nào. Hãy đăng nhập và vào trang quản trị để đăng bài.</p>";
        }
        return;
      }

      var newsHtml = "";

      querySnapshot.forEach(function (doc) {
        var post = doc.data();
        post.id = doc.id;

        // Chỉ hiện bài đã đăng, bỏ qua bản nháp
        if (post.status === "published") {
          newsHtml += createPostCard(post);
        }
      });

      document.getElementById("top-news").innerHTML += newsHtml;

      // Ghi nhớ bài cuối cùng để lần sau tải tiếp
      lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      // Hết bài thì ẩn nút tải thêm
      if (querySnapshot.size < PAGE_SIZE) {
        document.getElementById("btn-load").style.display = "none";
      }
    })
    .catch(function (error) {
      console.error("Lỗi tải bài viết:", error);
      document.getElementById("top-news").innerHTML = "<p>Không tải được bài viết.</p>";
    });
}

// ====== NÚT TẢI THÊM ======
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "btn-load") {
    loadPosts();
  }
});

// ====== TÌM KIẾM BÀI VIẾT THEO TIÊU ĐỀ ======
document.getElementById("form-search").addEventListener("submit", function (e) {
  e.preventDefault();

  var keyword = document.getElementById("txt-search").value.trim().toLowerCase();

  // Bỏ trống ô tìm kiếm thì tải lại danh sách ban đầu
  if (keyword === "") {
    lastDoc = null;
    document.getElementById("top-news").innerHTML = "";
    document.getElementById("btn-load").style.display = "inline-block";
    loadPosts();
    return;
  }

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (querySnapshot) {
      var newsHtml = "";

      querySnapshot.forEach(function (doc) {
        var post = doc.data();
        post.id = doc.id;

        if (post.status === "published" && post.title.toLowerCase().includes(keyword)) {
          newsHtml += createPostCard(post);
        }
      });

      if (newsHtml === "") {
        newsHtml = "<p>Không tìm thấy bài viết nào.</p>";
      }

      document.getElementById("top-news").innerHTML = newsHtml;
      document.getElementById("btn-load").style.display = "none";
    });
});
