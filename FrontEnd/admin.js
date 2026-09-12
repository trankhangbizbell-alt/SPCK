const search =
            document.getElementById("search");

        const articles =
            document.getElementById("articles");


        search.addEventListener(
            "keyup",
            function() {

                const keyword =
                    search.value.toLowerCase();


                const rows =
                    articles.querySelectorAll("tr");


                rows.forEach(function(row) {

                    const text =
                        row.innerText.toLowerCase();


                    if (
                        text.includes(keyword)
                    ) {

                        row.style.display = "";

                    } else {

                        row.style.display = "none";

                    }

                });

            }
        );