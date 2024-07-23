const ATTACK_VALUE=10;
const MONSTER_ATTACK_VALUE=14;
const STRONG_ATTACK_VALUE=17;
const HEAL_VALUE=20
const ATTACK_MODE='ATTACK';
const STRONG_ATTACK_MODE='STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK='PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK='MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL='PLAYER_HEAL';
const LOG_EVENT_GAME_OVER='GAME_OVER';

const enteredValue = prompt('Enter the maximum life for you and the monster','100');
let chosenMaxLife=parseInt(enteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife<=0){
    chosenMaxLife=100;
}
let currentMonsterHealth=100;
let currentPlayerHealth=100;
let hasBonusLife=true;
let battleLog=[];
adjustHealthBars(chosenMaxLife);

function writeToLog(ev,val,monsterHealth,playerHealth){
    let logEntry={
        event:ev,
        value:val,
        finalMonsterHealth:monsterHealth,
        finalPlayerHealth:playerHealth
    };
    switch(ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target='MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target='MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target='PLAYER'
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target='PLAYER'
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry={
                        event:ev,
                        value:val,
                        finalMonsterHealth:monsterHealth,
                        finalPlayerHealth:playerHealth
                    };
            break;
        default:
            logEntry={}
    }
    battleLog.push(logEntry);
}
function reset(){
    currentMonsterHealth=chosenMaxLife;
    currentPlayerHealth=chosenMaxLife;
    resetGame(chosenMaxLife);
}
function endRound(){
    const initialPlayerHealth=currentPlayerHealth;
    const playerDamage=dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth=currentPlayerHealth-playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);
    if (currentPlayerHealth<=0 && hasBonusLife ){
        hasBonusLife=false;
        removeBonusLife();
        currentPlayerHealth=initialPlayerHealth;
        alert('You would be dead but the bonus life saved you!');
        setPlayerHealth(initialPlayerHealth);
    }
    if(currentMonsterHealth<=0 && currentPlayerHealth>0){
        alert('You won!');
        writeToLog(LOG_EVENT_GAME_OVER,'PLAYER WON',currentMonsterHealth,currentPlayerHealth);
    }
    else if(currentPlayerHealth<=0 && currentMonsterHealth>0){
        alert('You lost!');
        writeToLog(LOG_EVENT_GAME_OVER,'MONSTER WON',currentMonsterHealth,currentPlayerHealth);
    }
    else if(currentPlayerHealth<=0 && currentMonsterHealth<=0){
        alert('You have a draw!');
        writeToLog(LOG_EVENT_GAME_OVER,'A DRAW',currentMonsterHealth,currentPlayerHealth);
    }
    if (currentMonsterHealth<=0 || currentPlayerHealth<=0) {
        reset(chosenMaxLife);
    }

}
function attackMonster(mode){
    const maxDamage = mode === ATTACK_MODE ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === ATTACK_MODE?LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    const damage=dealMonsterDamage(maxDamage);
    currentMonsterHealth-=damage;
    writeToLog(logEvent,damage,currentMonsterHealth,currentPlayerHealth);
    endRound();

}
function attackHandler(){
    attackMonster(ATTACK_MODE);
}
function strongAttackHandler(){
    attackMonster(STRONG_ATTACK_MODE)
}
function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth>=chosenMaxLife-HEAL_VALUE) {
        alert("You can't heal more than your max initial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    else {
        healValue = HEAL_VALUE
    }
  increasePlayerHealth(healValue);
  currentPlayerHealth+=healValue ;
  writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
  endRound();
}

let i=0;
function printLogHandler(){
    for(const logEntry of battleLog){
        console.log(`#${i}`);
        for (const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`);
        }
        i++
    }

}
attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);