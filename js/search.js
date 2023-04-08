function table(searchTerm) {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.products, (data, index) => {
        if (data) {
            // Check if the data matches the search term
            if (!searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase()) || data.username.toLowerCase().includes(searchTerm.toLowerCase())) {
                createEle("tr", tbody, tr => {
                    for (const value in data) {
                        createEle("td", tr, td => {
                            td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
                        });
                    }
                    createEle("td", tr, td => {
                        createEle("i", td, i => {
                            i.className += "fas fa-edit btnedit";
                            i.setAttribute(`data-id`, data.id);
                            i.onclick = editbtn;
                        });
                    })
                    createEle("td", tr, td => {
                        createEle("i", td, i => {
                            i.className += "fas fa-trash-alt btndelete";
                            i.setAttribute(`data-id`, data.id);
                            i.onclick = deletebtn;
                        });
                    })
                });
            }
        } else {
            notfound.textContent = "No record found in the database...!";
        }

    });
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    searchButton.onclick = () => {
        table(searchInput.value);
    }
}
