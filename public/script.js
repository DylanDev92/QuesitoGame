let FoodList;
let currentIndex;

async function GetFoodList(){
    let fetchData = await fetch('/food/menu', {method: "GET"});
    return await fetchData.json();
}

async function RefreshStats(){
    let fetchStats = await fetch("/stats", {method: "GET"});
    let stats = await fetchStats.json();
    document.getElementById('foodStat').textContent = stats.FoodStat + "/3";
    document.getElementById('waterStat').textContent = stats.WaterStat + "/3";
    document.getElementById('sleepStat').textContent = stats.SleepStat + "/3";
}

window.addEventListener('load', async () => {
    await RefreshStats();

    await GetFoodList().then(list => {
        FoodList = list;

        currentIndex = Math.floor(Math.random() * FoodList.length);
        randomFood = FoodList[currentIndex];
        document.getElementById('FoodName').textContent = randomFood.Name;
        document.getElementById('FoodImage').src = randomFood.Image;
    })
    
})

async function Feed(){
    await fetch("/food/feed", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({"type": FoodList[currentIndex].Type})}).then(res => {
        res.json().then(json => {
            if (json === true){
                if (FoodList[currentIndex].Type === "food"){
                    new Audio("/src/EatingSound.mp3").play();
                }
                if (FoodList[currentIndex].Type === "water"){
                    new Audio("/src/DrinkingEffects.mp3").play();
                }
            }
        })
    })

    await RefreshStats();
}

function ChangeFood(right){
    if (right === true){
        if (currentIndex !== (FoodList.length - 1)){
            currentIndex++;
            randomFood = FoodList[currentIndex];
            document.getElementById('FoodName').textContent = randomFood.Name;
            document.getElementById('FoodImage').src = randomFood.Image;
        }
    }
    else {
        if (currentIndex !== 0){
            currentIndex--;
            randomFood = FoodList[currentIndex];
            document.getElementById('FoodName').textContent = randomFood.Name;
            document.getElementById('FoodImage').src = randomFood.Image;
        }
    }
}

function PlaySound(){
    new Audio("/src/GoatSound.mp3").play();
}

let bulbTurn = true;
async function BulbTurn(){
    if (bulbTurn === true){
        bulbTurn = false;
        document.body.style.backgroundImage = "url(" + "/src/BackgroundNight.jpg" + ")";
        document.getElementById('GoatImg').style.filter = "brightness(50%)";

        await fetch("/food/feed", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({"type": "sleep"})});
    
        await RefreshStats();
    }
    else{
        bulbTurn = true;
        document.body.style.backgroundImage = "url(" + "/src/Background.jpg" + ")";
        document.getElementById('GoatImg').style.filter = "brightness(100%)";
    }
    new Audio("/src/SwitchEffect.mp3").play();
}

window.addEventListener('beforeunload', async () => {
    await fetch("/leave", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({"leaving": true})})
})