// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export function getYoutubeIdFromUrl(url) {
    return url.match(
        /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&]*).*/,
    )?.[1] ?? '';
}
// shout out mozillia docs LOL
// nah nvm
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export function getScratchPFP(username) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           console.log(xhttp.responseText);
        }
    };
    xhttp.open("GET", `https://api.scratch.mit.edu/users/${encodeURIComponent(username)}`, true);
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*")
    xhttp.send();
}
export function getLevelThumbnail(levelPos, list) {
            if (list == undefined || levelPos == undefined) {
            	return 0;
            } else {
                console.log("The List:");
                console.log(list);
                console.log("The Level Position:");
                console.log(levelPos);
                const currentLevel = list[levelPos][0];
                /* console.error(currentLevel);
                console.log("The List:");
                console.log(list);
                console.log("The Level Position:");
                console.log(levelPos);
                console.log("The Current Level:");
                console.log(currentLevel); */
                // do not close WHY CLOSE!!!!!!!
                // old code (yt thumbnail)
                // return `background-image: url(https://img.youtube.com/vi/${getYoutubeIdFromUrl(currentLevel.verification)}/mqdefault.jpg);`;
                return setUpThumbnailStyle(currentLevel.name);
            }
}
export function getLevelThumbnailR(levelPos, list) {
            if (list == undefined || levelPos == undefined) {
            	return 0;
            } else {
                console.log("The List:");
                console.log(list);
                console.log("The Level Position:");
                console.log(levelPos);
                const currentLevel = list[levelPos];
                return setUpThumbnailStyle(currentLevel.name);
            }
}
function setUpThumbnailStyle(levelName) {
    			if (levelName == "getting kicked out of train") {
                    return `background-image: linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)), url(https://www.amtrak.com/content/dam/projects/dotcom/english/public/images/heros/couple-cafe-window-view.jpg); background-size: cover; background-repeat: no-repeat; background-position: center;`
                } else {
                return `background-image: linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)), url("https://therakelist.pages.dev/assets/levels/${encodeURIComponent(levelName)}.png"); background-size: cover; background-repeat: no-repeat; background-position: center;`
				}
            }
export function embed(video) {
        return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
}
export function mamaMia(swaggers) {
     console.log("../assets/" + swaggers + ".svg");
     return "../assets/" + swaggers + ".svg";
}
export async function getPeople() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           console.log("yes sir");
           document.getElementById("displayVisits").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", "../data/stats/displayVisits.php", true);
    xhttp.send();
}
export async function incVisits() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
        }
    };
    xhttp.open("GET", "../data/stats/incrementVisits.php", true);
    xhttp.send();
}
var incGDR = 0;
export async function otherStats(list) {
    for (let i = 0; i < list.length; i++) {
  		console.log(list[i].find(isGDR));
	}
    var timeDifference;
    var j;
    j = new Date();
    timeDifference = Math.floor(((new Date() / 1000) - 1758984420) / 86400);
    console.log(timeDifference);
    console.log(incGDR);
    document.getElementById("displayListLength").innerHTML = list.length;
    document.getElementById("displayMostUsedEngine").innerHTML = incGDR;
    document.getElementById("displayDaysSincePublic").innerHTML = timeDifference;
}

function isGDR(level) {
  if (level === null) {
      return 0;
  } else {
      if (level.engine === "GDR") {
          incGDR++;
      }
      return level.engine === "GDR";
  }
}
export function localize(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

export function doStuff(levelName) {
    return "background-image: url('../assets/levels/Greyhound.webp');";
}
export function getEngineSelect() {
    console.log("juz pomnie,.");
    let params = new URLSearchParams(document.location.search); 
    console.log(params.get("method"));
    if (params.get("method") == "All") {
        return null;
    } else {
        return params.get("method");
    }
}
export function getFpsSelect() {
    console.log("work hello please");
    let params = new URLSearchParams(document.location.search); 
    console.log(params.get("fps"));
    if (params.get("fps") == "") {
        return null;
    } else {
        return params.get("fps");
    }
}
export function getSelectSelect(list) {
    console.log("Yayers");
    let params = new URLSearchParams(document.location.search); 
    let selectedInt = parseInt(params.get("selected"));
    console.log(params.get("selected"));
    if (selectedInt == null || isNaN(selectedInt) || selectedInt - 1 > list.length || selectedInt - 1 < 0) {
        return null;
    } else {
        return selectedInt - 1;
    }
	return selectedInt - 1;
}

export function selectRandomLevel(levels) {
    console.log("They done clicked the egg button!!!");
	let randomLevel = getRandomInt(levels.length)
	return randomLevel;
}

export function getThumbnailFromId(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}
