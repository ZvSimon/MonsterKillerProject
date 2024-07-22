const ATTACK_VALUE=10;

let currentMonsterHealth=100;
let currentPlayerHealth=100;
let chosenMaxLife=100;
adjustHealthBars(chosenMaxLife);
function attackHandler(){
    const damage=dealMonsterDamage(ATTACK_VALUE);
   currentMonsterHealth=currentMonsterHealth-damage;
}
attackBtn.addEventListener('click',attackHandler);