window.addEventListener('DOMContentLoaded', () => {
	let titles = document.getElementsByClassName("section-title");
	let section_contents = document.getElementsByClassName("section-contents");
	let original_display_styles = [];

	for (let i = 0; i < section_contents.length; i++) {
		original_display_styles.push(section_contents[i].style.display);
		if (section_contents[i].classList.contains("hide-by-default")) {
			section_contents[i].style.display = "none";
		}		
	}

	for (let i = 0; i < titles.length; i++) {
		titles[i].addEventListener("click", function(event) {
			let contents = section_contents[i];
			if (window.getComputedStyle(contents).display === "none") {
				contents.style.display = original_display_styles[i];
			}
			else {
				contents.style.display = "none";
			}
		});
	}
});
