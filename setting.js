//Reset the overall deal & players info
//Player's total amount may vary depends on the results of the previous games
const resetGameSetting = () => {
  document.getElementById("playerList").style.display = "none";
  resetVariables();
  let firstPlayThrough = false;
  if (playerList.length == 0) {
    firstPlayThrough = true;
  }
  const tempDealer = {
    memberName: "Dealer",
    cards: [],
    id: "dealer",
    currentSum: [],
    bustedArray: [],
    isBust: false,
    gameOver: false,
    blackJack: false,
    playerIndex: 0,
    isFirstAce: true,
  };
  playerList.push(tempDealer);
  for (let i = 1; i <= maxPlayerCount; i++) {
    const tempObj = {
      memberName: "Player " + i,
      cards: [],
      id: "playerId" + i,
      currentSum: [],
      bustedArray: [],
      isBust: false,
      gameOver: false,
      blackJack: false,
      playerIndex: i,
      totalAmount: null,
      betAmount: 0,
      pressDouble: false,
    };
    tempObj.totalAmount = firstPlayThrough
      ? playerMoney
      : playerList[i].totalAmount;
    playerList.push(tempObj);
  }
  if (!firstPlayThrough) {
    playerList.splice(0, maxPlayerCount + 1);
  }
  console.log(playerList);
  preSettingGame();
};

//Reset the necessary variables
const resetVariables = () => {
  turnCount = 1;
  dealerTurn = false;
  dealerFinish = false;
  dealerSum = 0;
  restartGame = false;
  isFinished = [];
  for (i = 0; i < maxPlayerCount; i++) {
    isFinished.push(false);
  }
};

//Setting players' bets before the game starts
const preSettingGame = () => {
  document.getElementById("playerBetsList").style.display = "block";
  const preGameTitle = document.getElementById("preGameTitle");
  preGameTitle.innerText = "Please place your bets!";
  playerList.forEach((indiePlayer) => {
    if (indiePlayer.memberName !== "Dealer") {
      const tempId = "prePlayerName" + indiePlayer.playerIndex;
      const playerNameElement = document.getElementById(tempId);
      playerNameElement.innerText = indiePlayer.memberName;

      const tempAmount = "player" + indiePlayer.playerIndex + "TotalAmount";
      const playerTotalAmountElement = document.getElementById(tempAmount);
      playerTotalAmountElement.innerText = "/\xa0$" + indiePlayer.totalAmount;
    }
  });
  const startBtn = document.getElementById("startButton");
  startBtn.onclick = startGame;
};

//Begin the game
//Check if input is valid
const startGame = () => {
  playerList.forEach((indiePlayer) => {
    if (indiePlayer.id !== "dealer") {
      const tempId = "player" + indiePlayer.playerIndex + "Bar";
      const bets = document.getElementById(tempId);
      if (bets.value > playerMoney) {
        alert("Invalid amount. Reset to $1000");
        bets.value = 0;
      }
      if (bets.value == 0) {
        indiePlayer.betAmount = 1000;
      } else {
        indiePlayer.betAmount = bets.value;
      }
    }

    const { cards } = indiePlayer;
    cards.push(addCard());
    cards.push(addCard());
    if (indiePlayer.id == "dealer") {
      indiePlayer.currentSum = addDealerSum(indiePlayer);
    } else {
      indiePlayer.currentSum = addSum(cards, indiePlayer.currentSum);
    }
    checkBlackJack(indiePlayer);
  });
  document.getElementById("playerBetsList").style.display = "none";

  let gameOverall = document.getElementById("playerList");
  gameOverall.innerHTML = clone;
  renderOverView();
};
let clone = document.getElementById("playerList").innerHTML;
resetGameSetting();
