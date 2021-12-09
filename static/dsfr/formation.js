document.getElementById("search-784-input").addEventListener("keyup", function(event) {
    let searchQuery = event.target.value.toLowerCase();
    let allNames = document.getElementsByClassName('name');

    for (let counter = 0; counter < allNames.length; counter++) {
        const currentName = allNames[counter].textContent.toLowerCase();

        if (currentName.includes(searchQuery)) {
            allNames[counter].style.display = "block";
        } else {
            allNames[counter].style.display = "none";
        }
    }
});
