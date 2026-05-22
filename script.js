let streak =
    Number(localStorage.getItem("streak")) || 0;

let lastActiveDate =
    localStorage.getItem("lastActiveDate") || "";

let dailyStats = {
    total: 0,
    done: 0
};


let money =
    Number(localStorage.getItem("money")) || 0;

let birthYear =
    localStorage.getItem("birthYear");
let level = 1;
let xp = 0;

let stats = {
    force: 0,
    endurance: 0,
    knowledge: 0,
    discipline: 0
};

let quests =
    JSON.parse(localStorage.getItem("quests")) || [];

let lastResetDate =
    localStorage.getItem("lastResetDate") || "";


// PLAYER INFO
let playerName =
    localStorage.getItem("playerName") || "";

let age =
    Number(localStorage.getItem("age")) || "";

let gender =
    localStorage.getItem("gender") || "";




// SAVE PLAYER INFO
function savePlayerInfo() {

    let name =
        document.getElementById("setupName").value;

    let playerAge =
        document.getElementById("setupAge").value;

    let playerGender =
        document.getElementById("setupGender").value;

    if (!name || !playerAge) return;

    playerName = name;

    // AGE SYSTEM (real time progression)
    let currentYear =
        new Date().getFullYear();

    age = Number(playerAge);
    birthYear = currentYear;

    gender = playerGender;

    localStorage.setItem(
        "playerName",
        playerName
    );

    localStorage.setItem(
        "age",
        age
    );

    localStorage.setItem(
        "birthYear",
        birthYear
    );

    localStorage.setItem(
        "gender",
        gender
    );

    document
        .getElementById("setupPopup")
        .style.display = "none";

    updateUI();
}


function getRealAge() {

    let currentYear =
        new Date().getFullYear();

    if (!birthYear) return age;

    return age + (currentYear - birthYear);
}





// XP NEEDED
function xpNeeded(level) {

    return Math.floor(
        60 * Math.pow(1.3, level - 1)
    );
}


// SAVE
function save() {

    localStorage.setItem("level", level);

    localStorage.setItem("xp", xp);

    localStorage.setItem(
        "stats",
        JSON.stringify(stats)
    );

    localStorage.setItem(
        "quests",
        JSON.stringify(quests)
    );

    localStorage.setItem(
        "lastResetDate",
        lastResetDate
    );

    localStorage.setItem(
        "money",
        money
    );

    localStorage.setItem(
        "playerName",
        playerName
    );
    
    localStorage.setItem(
        "age",
        age
    );
    
    localStorage.setItem(
        "gender",
        gender
    );
}


// LOAD
function load() {

    let l =
        localStorage.getItem("level");

    let x =
        localStorage.getItem("xp");

    let s =
        localStorage.getItem("stats");

    let q =
        localStorage.getItem("quests");

    if (l) level = Number(l);

    if (x) xp = Number(x);

    if (s) stats = JSON.parse(s);

    if (q) quests = JSON.parse(q);
}


// DAILY RESET
function resetDailyQuests() {

    let today =
        new Date().toDateString();

    if (lastResetDate === today) return;

    quests.forEach(q => {

        if (q.type === "daily") {

            q.done = false;
        }
    });

    lastResetDate = today;

    save();
}


// ADD QUEST
function addQuest() {

    let name =
        document.getElementById("questName").value;

    let type =
        document.getElementById("questType").value;

    let xpValue =
        Number(document.getElementById("questXP").value);

    let stat =
        document.getElementById("questStat").value;

    let statValue =
        Number(document.getElementById("questStatValue").value);

    if (
        !name ||
        isNaN(xpValue) ||
        isNaN(statValue) ||
        xpValue < 0
    ) return;

    quests.push({

        id: Date.now(),

        name,

        type,

        xp: xpValue,

        stat,

        statValue,

        done: false
    });

    save();

    renderQuests();

    document.getElementById("questName").value = "";

    document.getElementById("questXP").value = "";

    document.getElementById("questStatValue").value = "";
}


// DELETE QUEST
function deleteQuest(id) {

    quests =
        quests.filter(q => q.id !== id);

    save();

    renderQuests();
}


// COMPLETE QUEST
function completeQuest(id) {

    let q =
        quests.find(q => q.id === id);

    if (!q || q.done) return;

    q.done = true;

    addXP(q.xp);

    showQuestPopup(q);

    updateDailySystem();

if (q.type === "daily") {

    dailyStats.total += 1;
    dailyStats.done += 1;

    // streak logic
    let today =
        new Date().toDateString();

    if (lastActiveDate === today) {

        // continue streak
        streak++;
    }

    localStorage.setItem("streak", streak);
}

    stats[q.stat] = Math.max(
        0,
        +(stats[q.stat] + q.statValue).toFixed(1)
    );

    document
        .getElementById("questSound")
        .play();

    if (q.type !== "daily") {

        quests =
            quests.filter(x => x.id !== id);
    }

    save();

    renderQuests();

    updateUI();
}


// XP SYSTEM
function addXP(amount) {

    xp += amount;

    // LEVEL UP
    while (xp >= xpNeeded(level)) {

        xp -= xpNeeded(level);

        level++;

        showLevelUp();
    }

    // LEVEL DOWN
    while (xp < 0 && level > 1) {

        level--;

        xp += xpNeeded(level);
    }

    // sécurité
    if (level < 1) {

        level = 1;

        xp = 0;
    }

    updateUI();

    save();
}


// UPDATE UI
function updateUI() {

    document.getElementById("level").innerText =
        level;

    let need =
        xpNeeded(level);

    let percent =
        Math.min((xp / need) * 100, 100);


    document
        .getElementById("xpBar")
        .style.width = percent + "%";

    document
        .getElementById("xpText")
        .innerText =
        xp + " / " + need + " XP";

    document.getElementById("force").innerText =
        stats.force;

    document.getElementById("endurance").innerText =
        stats.endurance;

    document.getElementById("knowledge").innerText =
        stats.knowledge;

    document.getElementById("discipline").innerText =
        stats.discipline;

    document.getElementById("fullName").innerText =
        playerName;

    document.getElementById("age").innerText = getRealAge();

    document.getElementById("gender").innerText =
        gender;

    document.getElementById("rank").innerText =
        getRank();

    document.getElementById("powerLevel").innerText =
        getPowerLevel();

    document.getElementById("nextRank").innerText =
        getNextRankProgress();

    document.getElementById("money").innerText =
    money + " €";
    
document.getElementById("streak").innerText =
    streak;

document.getElementById("dailyPercent").innerText =
    getDailyCompletionPercent() + "%";

document.getElementById("disciplineScore").innerText =
    getDisciplineScore();
}


// RANK SYSTEM
function getRank() {

    let power =

        stats.force +

        stats.endurance +

        stats.knowledge +

        stats.discipline +

        level;

    if (power >= 1000) return "SSS";

    if (power >= 700) return "SS";

    if (power >= 450) return "S";

    if (power >= 250) return "A";

    if (power >= 120) return "B";

    if (power >= 60) return "C";

    if (power >= 25) return "D";

    return "E";
}


// POWER LEVEL
function getPowerLevel() {

    return Math.floor(

        stats.force +

        stats.endurance +

        stats.knowledge +

        stats.discipline +

        level
    );
}


// NEXT RANK
function getNextRankProgress() {

    let power =
        getPowerLevel();

    if (power < 25) {
        return (25 - power) + " power for D";
    }

    if (power < 60) {
        return (60 - power) + " power for C";
    }

    if (power < 120) {
        return (120 - power) + " power for B";
    }

    if (power < 250) {
        return (250 - power) + " power for A";
    }

    if (power < 450) {
        return (450 - power) + " power for S";
    }

    if (power < 700) {
        return (700 - power) + " power for SS";
    }

    if (power < 1000) {
        return (1000 - power) + " power for SSS";
    }

    return "MAX RANK";
}


// RENDER QUESTS
function renderQuests() {

    let daily =
        document.getElementById("dailyQuests");

    let main =
        document.getElementById("mainQuests");

    let side =
        document.getElementById("sideQuests");

    daily.innerHTML = "";

    main.innerHTML = "";

    side.innerHTML = "";

    quests.forEach(q => {

        let div =
            document.createElement("div");

        div.className = "quest";

        div.innerHTML = `

            <span>${q.name} (${q.xp} XP)</span>

            <div>

                <button
                onclick="completeQuest(${q.id})"
                ${q.done ? "disabled" : ""}
                >

                ${q.done ? "COMPLETED" : "DONE"}

                </button>

                <button onclick="deleteQuest(${q.id})">
                    DELETE
                </button>

            </div>
        `;

        if (q.type === "daily") {

            daily.appendChild(div);
        }

        else if (q.type === "main") {

            main.appendChild(div);
        }

        else {

            side.appendChild(div);
        }
    });
}


// STAT NAME
function getStatName(stat) {

    if (stat === "force")
        return "STRENGTH";

    if (stat === "endurance")
        return "ENDURANCE";

    if (stat === "knowledge")
        return "INTELLIGENCE";

    if (stat === "discipline")
        return "DISCIPLINE";

    return stat.toUpperCase();
}


// QUEST POPUP
function showQuestPopup(q) {

    let popup =
        document.getElementById("questPopup");

    popup.innerHTML = `

        QUEST COMPLETED<br>

        +${q.xp} XP<br>

        ${getStatName(q.stat)} +${q.statValue}
    `;

    popup.classList.add("show");

    setTimeout(() => {

        popup.classList.remove("show");

    }, 1200);
}


// LEVEL UP
function showLevelUp() {

    let el =
        document.getElementById("levelUp");

    el.classList.add("show");

    document
        .getElementById("levelSound")
        .play();

    setTimeout(() => {

        el.classList.remove("show");

    }, 1200);
}


// MONEY
function changeMoney(amount) {

    money += amount;

    if (money < 0) {

        money = 0;
    }

    updateUI();

    save();
}


// RESET
function openResetPopup() {

    document
        .getElementById("resetPopup")
        .classList.add("show");
}


function closeResetPopup() {

    document
        .getElementById("resetPopup")
        .classList.remove("show");
}


function confirmReset() {

    localStorage.clear();

    level = 1;

    xp = 0;

    money = 0;

    stats = {

        force: 0,

        endurance: 0,

        knowledge: 0,

        discipline: 0
    };

    quests = [];

    closeResetPopup();

    location.reload();

    localStorage.removeItem("birthYear");
}



// INIT
load();

resetDailyQuests();

renderQuests();

updateUI();


// OPEN PLAYER CREATION
if (!playerName) {

    document
        .getElementById("setupPopup")
        .style.display = "flex";
}
else {

    document
        .getElementById("setupPopup")
        .style.display = "none";
}


function updateDailySystem() {

    let today =
        new Date().toDateString();

    // reset daily stats if new day
    if (lastActiveDate !== today) {

        dailyStats.total = 0;
        dailyStats.done = 0;

        lastActiveDate = today;

        localStorage.setItem("lastActiveDate", today);
    }
}

if (q.type === "daily") {
    dailyStats.total += 1;
}

function getDailyCompletionPercent() {

    if (dailyStats.total === 0) return 0;

    return Math.round(
        (dailyStats.done / dailyStats.total) * 100
    );
}

function getDisciplineScore() {

    let percent =
        getDailyCompletionPercent();

    return Math.floor(
        (streak * 2) + percent
    );
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}