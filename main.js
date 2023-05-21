//Display selected files
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this)
        .siblings(".custom-file-label")
        .addClass("selected")
        .html(fileName);
});
window.apikey = `u6cqmb5C1E-KwtdfbozgxOyxdawKHM3qmJALBxGb0nQ`; //replace your api key here
document.getElementById("submit").onclick = async function () {
    var textvalue = document.getElementById("result").value;
    var files = document.getElementById("selectFiles").files;
    if (files.length > 0) {
        try {
            var fr = new FileReader();
            fr.onload = (e) => {
                let result = JSON.parse(e.target.result);
                document.getElementById("result").value = e.target.result;
                getData(result.address);
            };
            fr.readAsText(files.item(0));
        } catch (e) {
            console.log(e);
            alert("Invalid JSON");
        }
    } else {
        try {
            let result = JSON.parse(textvalue);
            document.getElementById("result").value = textvalue;
            getData(result.address);
        } catch (e) {
            console.log(e);
            alert("Invalid JSON");
        }
    }
};
// passing an address array to fetch the matching address's score
function getData(addressArray) {
    if (addressArray.length > 10) {
        alert("Cannot process more than 10 addresses");
        return false;
    }
    let array = Promise.all(
        addressArray.map((addres) =>
            fetch(
                `https://geocode.search.hereapi.com/v1/geocode?apiKey=${window.apikey}&q=${addres}&lang=en-US`
            )
                .then((response) => response.json())
                .then((data) => data)
        )
    )
        .then(function (data) {
            appendData(data);
        })
        .catch((e) => console.log(e));
}
//Display data in tabular format
function appendData(data) {
    var mainContainer = document.getElementById("myData");
    document.getElementById("submit").style.display = "block";
    document.getElementById("result").style.display = "block";
    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.border = "1";
    table.class = "table";
    //Get the count of columns.
    var columnCount = data.length;
    //Add the header row.
    var row = table.insertRow(-1);
    var headerCell = document.createElement("TH");
    var headerCell1 = document.createElement("TH");
    headerCell.innerHTML = "<b>Address</b>";
    headerCell1.innerHTML = "<b>Score</b>";
    row.appendChild(headerCell);
    row.appendChild(headerCell1);

    for (var i = 0; i < data.length; i++) {
        var color = ``;
        let score = Number(
            data[i]["items"][0]["scoring"]["queryScore"] * 100
        );

        if (score >= 90) {
            color = "green";
        }

        if (score >= 80 && score < 90) {
            color = "orange";
        }

        if (score < 80) {
            color = "red";
        }

        row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        var cell1 = row.insertCell(-1);
        cell.innerHTML = data[i]["items"][0]["title"];
        cell1.style.backgroundColor = color;
        cell1.innerHTML = Math.round(
            Number(data[i]["items"][0]["scoring"]["queryScore"] * 100)
        );
    }
    var dvTable = document.getElementById("myData");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}