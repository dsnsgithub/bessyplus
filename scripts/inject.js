const round = (number, decimalPlaces) => {
	const factorOfTen = Math.pow(10, decimalPlaces);
	return Math.round(number * factorOfTen) / factorOfTen;
};

const gradingScale = [
	{
		grade: "F",
		cutoff: 0,
		average: 50
	},
	{
		grade: "D-",
		cutoff: 60,
		average: 60
	},
	{
		grade: "D",
		cutoff: 63,
		average: 63
	},
	{
		grade: "D+",
		cutoff: 67,
		average: 67
	},
	{
		grade: "C-",
		cutoff: 70,
		average: 70
	},
	{
		grade: "C",
		cutoff: 73,
		average: 73
	},
	{
		grade: "C+",
		cutoff: 77,
		average: 77
	},
	{
		grade: "B-",
		cutoff: 80,
		average: 80
	},
	{
		grade: "B",
		cutoff: 83,
		average: 83
	},
	{
		grade: "B+",
		cutoff: 87,
		average: 87
	},
	{
		grade: "A-",
		cutoff: 90,
		average: 90
	},
	{
		grade: "A",
		cutoff: 93,
		average: 93
	}
];

function getGrade(cleanGrade) {
	for (let i = gradingScale.length - 1; i >= 0; i--) {
		if (cleanGrade >= gradingScale[i].cutoff) {
			return gradingScale[i].grade;
		}
	}
	// If the cleanGrade is below the minimum cutoff, return "F"
	return "F";
}

function hasGradeLetter(inputString) {
	const gradeLetters = new Set(["A", "B", "C", "D", "F"]);
	return [...inputString].some((letter) => gradeLetters.has(letter));
}

function calculateAverage() {
	const gradeList = document.querySelectorAll(".text-grade");
	let numPeriods = gradeList.length;

	let sum = 0;
	let lowestGrade = Infinity;
	for (const gradeElem of gradeList) {
		const cleanGrade = parseGradeString(gradeElem.innerText);

		if (gradeElem.innerText.includes("—")) {
			numPeriods--;
			continue;
		};

		if (!gradeElem.innerText.includes("%")) {
			gradeElem.innerText = `${gradeElem.innerText} (${cleanGrade}%)`;
		} else {
			if (!hasGradeLetter(gradeElem.innerText)) {
				gradeElem.innerText = `${getGrade(cleanGrade)} (${cleanGrade}%)`;
			}
		}

		sum += cleanGrade;
		lowestGrade = Math.min(lowestGrade, cleanGrade);
	}

	const average = sum / numPeriods;
	console.log("Average: ", round(average, 2));

	const wrapper = document.createElement("h3");
	wrapper.innerHTML = `<div style="margin-right:15px; display:inline-block;">Average: <span class="text-grade bessy-plus">${round(average, 2)}%</span></div>`;
	wrapper.innerHTML += "<span>|</span>";
	wrapper.innerHTML += `<div style="margin-left:15px; display:inline-block;">Lowest Grade: <span class="text-grade bessy-plus">${round(lowestGrade, 2)}%</span></div>`;

	const gradeTitle = document.querySelector(".flex.items-center.space-x-1.text-gray-600");
	gradeTitle.after(wrapper);
}

function averageIfPossible() {
	if (window.location.href != "https://www.bessy.io/") return;
	if (document.querySelectorAll(".bessy-plus").length) return;

	const intervalId = setInterval(() => {
		if (document.querySelectorAll(".text-grade").length >= 1) {
			clearInterval(intervalId);
			calculateAverage();
		}
	}, 100);
}

function parseGradeString(gradeString) {
	let cleanGrade;
	if (gradeString.split(" ").length > 1) {
		grade = gradeString.split(" ")[1];
		cleanGrade = Number(grade.substring(1, grade.length - 2));
	} else {
		if (gradeString.includes("%")) {
			cleanGrade = Number(gradeString.substring(0, gradeString.length - 1));
		} else {
			// standards based grading
			if (gradeString == 4) {
				cleanGrade = 100;
			} else if (gradeString <= 4 && gradeString > 3) {
				cleanGrade = 7 * gradeString + 72;
			} else if (gradeString <= 3 && gradeString > 2) {
				cleanGrade = 7 * gradeString + 72;
			} else if (gradeString <= 2 && gradeString > 1.5) {
				cleanGrade = 20 * gradeString + 46;
			} else if (gradeString <= 1.5 ** gradeString > 1) {
				cleanGrade = 20 * gradeString + 46;
			} else {
				cleanGrade = 55;
			}
		}
	}

	return cleanGrade;
}

function calculateMinimumGrade(desiredScore) {
	const categoryCurrentGradeElem = document.querySelectorAll(".text-grade-modified")[1];

	const [score, maxScore] = document.querySelectorAll("input");

	if (!maxScore.value) {
		maxScore.value = 100;
	}

	const categoryWeightElem = categoryCurrentGradeElem.parentElement.querySelector("span").querySelector("span");
	const categoryName = categoryWeightElem.parentElement.children[0].innerText;
	const categoryWeight = categoryWeightElem.innerText.split(" ")[1];
	const cleanCategoryWeight = Number(categoryWeight.substring(0, categoryWeight.length - 1));

	// get the gradelist
	let currentCategoryPoints = 0;
	let maxCategoryPoints = 0;
	const gradeListElem = categoryCurrentGradeElem.parentElement.parentElement.parentElement.parentElement.children[1];
	const gradeList = gradeListElem.querySelectorAll(".font-semibold.text-grade");

	for (const assignmentGrade of gradeList) {
		if (assignmentGrade.innerText == "Excused") continue;
		currentCategoryPoints += Number(assignmentGrade.innerText.split("/")[0]);
		maxCategoryPoints += Number(assignmentGrade.innerText.split("/")[1]);
	}

	console.log(currentCategoryPoints, maxCategoryPoints, cleanCategoryWeight, Number(maxScore.value));

	let otherTotal = 0;
	let totalPercent = 0;
	const allCategoryPercents = document.querySelectorAll(".text-neutral-500");
	const allCategoryGrades = document.querySelectorAll(".flex-1.flex.items-end.justify-end");

	for (let index = 0; index < allCategoryPercents.length; index++) {
		const indexedCategoryName = allCategoryPercents[index].parentElement.children[0].innerText;

		if (allCategoryGrades[index].innerText == "—" && categoryName != indexedCategoryName) continue;

		const indexedCategoryPercent = allCategoryPercents[index].innerText.split(" ")[1];
		const indexedCleanCategoryPercent = Number(indexedCategoryPercent.substring(0, indexedCategoryPercent.length - 1));
		totalPercent += indexedCleanCategoryPercent / 100;

		if (categoryName == indexedCategoryName) continue;
		const indexedCleanCategoryGrade = parseGradeString(allCategoryGrades[index].innerText);
		otherTotal += (indexedCleanCategoryPercent / 100) * (indexedCleanCategoryGrade / 100);
	}

	console.log(otherTotal);

	//? (otherTotal + (cleanCategoryWeight * neededCategoryGrade))/totalPercent = desiredScore
	//? otherTotal + (cleanCategoryWeight * neededCategoryGrade) = (desiredScore * totalPercent)
	//? (cleanCategoryWeight * neededCategoryGrade) = (desiredScore * totalPercent) - otherTotal
	const neededCategoryGrade = ((desiredScore / 100) * totalPercent - otherTotal) / (cleanCategoryWeight / 100);

	//? neededCategoryGrade = (currentCategoryPoints + score) / (maxCategoryPoints + maxScore.value)
	//? neededCategoryGrade * (maxCategoryPoints + maxScore.value) = (currentCategoryPoints + score)
	let unroundedScore = neededCategoryGrade * (maxCategoryPoints + Number(maxScore.value)) - currentCategoryPoints;

	// desiredScore = [(1-finalExamPercent) * cleanGrade] + (finalExamPercent * score)
	// desiredScore - [(1-finalExamPercent) * cleanGrade] = finalExamPercent * score
	// (desiredScore - [(1-finalExamPercent) * cleanGrade])/finalExamPercent = score
	// const unroundedScore = (desiredScore - (1 - finalExamPercent) * cleanGrade) / finalExamPercent;

	if (unroundedScore < 0) {
		unroundedScore = 0;
	}
	score.value = Math.ceil(unroundedScore);

	score.focus();
	maxScore.focus();
}

function placeButton() {
	if (document.querySelectorAll(".bessy-plus").length) return;
	const gradeBox = document.querySelector("input").parentElement.parentElement;

	const usefulGradeValues = [90, 93];
	for (const usefulGrade of usefulGradeValues) {
		const calculateButton = document.createElement("h3");
		calculateButton.className =
			"bessy-plus duration-150 font-medium rounded border-2 no-tap-highlight-color disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 outline-offset-4 not-focus-visible:focus:ring-[3px] px-3 py-2 bg-deepblue/90 not-disabled:hover:bg-blue-500/90 not-disabled:active:bg-blue-500/90 text-white dark:bg-deepblue dark:not-disabled:hover:bg-blue-500 dark:not-disabled:active:bg-blue-500 dark:ring-blue-500/50 border-transparent border-2";
		calculateButton.textContent = `Calculate for ${usefulGrade}%`;
		calculateButton.addEventListener("click", () => {
			calculateMinimumGrade(usefulGrade);
		});

		gradeBox.appendChild(calculateButton);
	}
}

function calculateWhenPossible() {
	if (!window.location.href.includes("https://www.bessy.io/grades/")) return;
	if (document.querySelectorAll(".bessy-plus").length) return;

	const expectedCount = 2;
	const intervalId = setInterval(() => {
		if (document.querySelectorAll("input").length == expectedCount) {
			clearInterval(intervalId);
			placeButton();
		}
	}, 100);
}

function refresh() {
	averageIfPossible();
	calculateWhenPossible();
}

window.addEventListener("load", refresh);
window.addEventListener("click", refresh);
