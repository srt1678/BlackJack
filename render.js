const playerMoney = 10000;
const maxPlayerCount = 4;
let playerList = [];
let turnCount = 1;
let isFinished = [];
let dealerTurn = false;
let dealerFinish = false;
let dealerSum = 0;
let restartGame = false;

//First render overview
const renderOverView = () => {
  let playerListElement = document.getElementById("playerList");
  playerListElement.style.display = "block";

  playerList.forEach((indiePlayer) => {
    const tempPlayerBetAmount = "playerBetAmount" + indiePlayer.playerIndex;
    const tempPlayerMoney = "playerMoney" + indiePlayer.playerIndex;
    const playerBetAmount = document.getElementById(tempPlayerBetAmount);
    const playerMoney = document.getElementById(tempPlayerMoney);
    if (indiePlayer.id !== "dealer") {
      playerBetAmount.innerText = "";
      playerBetAmount.innerText += "$" + indiePlayer.betAmount;
      playerMoney.innerText = "";
      playerMoney.innerText += "$" + indiePlayer.totalAmount;
    }
    renderCards(indiePlayer);
    renderTotalSum(indiePlayer);
    renderButtonOverview(indiePlayer);
  });
};

//Reset players' button options
const resetButtonView = (indiePlayer) => {
  const tempName = "player" + indiePlayer.playerIndex + "ButtonOverall";
  const buttonOverallElement = document.getElementById(tempName);
  buttonOverallElement.innerHTML = "";
};

//Render newest bet amount after player select 'Double'
const renderDoubleAmount = (indiePlayer) => {
  const tempPlayerBetAmount = "playerBetAmount" + indiePlayer.playerIndex;
  const playerBetAmount = document.getElementById(tempPlayerBetAmount);
  playerBetAmount.innerText = "";
  playerBetAmount.innerText += "$" + indiePlayer.betAmount;
};

//Render overview during game process
const renderNewerView = () => {
  playerList.forEach((indiePlayer) => {
    if (indiePlayer.isBust && indiePlayer.gameOver) {
      bustedCardDisplay(indiePlayer);
    }
    renderButtonOverview(indiePlayer);
  });
  if (!isFinished.includes(false) && !dealerTurn) {
    dealerTurn = true;
    turnCount = 0;
    console.log("dealerTurn: " + dealerTurn);
    console.log(turnCount);
    renderDealerReveal(playerList[0]);
    renderTotalSum(playerList[0]);
    renderContinueButton(playerList[0]);
  }
};

//Render players' buttons
const renderButtonOverview = (indiePlayer) => {
  //Skip the player's turn (button option) if player hits 21
  if (turnCount == indiePlayer.playerIndex && indiePlayer.blackJack) {
    rotateTurn();
  } else if (!indiePlayer.gameOver && indiePlayer.playerIndex == turnCount) {
    const tempName = "player" + indiePlayer.playerIndex + "ButtonOverall";
    const buttonOverallElement = document.getElementById(tempName);
    buttonOverallElement.className = "buttonOverall";
    const hitButton = renderHitButton(indiePlayer);
    buttonOverallElement.appendChild(hitButton);
    if (!indiePlayer.pressDouble) {
      const standButton = renderStandButton(indiePlayer);
      buttonOverallElement.appendChild(standButton);
      const doubleButton = renderDoubleButton(indiePlayer);
      buttonOverallElement.appendChild(doubleButton);
    }
  }
};

//Render dealer's continue button
const renderContinueButton = (indiePlayer) => {
  const dealerAreaElement = document.getElementById("dealerArea");
  const dealerContinueBtn = renderDealerButton(indiePlayer);
  dealerAreaElement.appendChild(dealerContinueBtn);
};

//Print out first two card info
//Dealer will have one face down (hidden) card
const renderCards = (indiePlayer) => {
  const { cards, id, playerIndex } = indiePlayer;
  if (id == "dealer" && !dealerTurn) {
    const dealerCardElement = document.getElementById("dealerCards");
    const dealerFirstCard = document.createElement("img");
    dealerFirstCard.className = "dealerSingleCardStyle";
    const suitsNum = randomCardSuitNumber();
    dealerFirstCard.src = "cardsPics/card" + cards[0] + suitsNum + ".png";

    const dealerSecondCard = document.createElement("img");
    dealerSecondCard.className = "dealerHiddenCard";
    dealerSecondCard.src = "cardsPics/card0.png";
    dealerCardElement.appendChild(dealerFirstCard);
    dealerCardElement.appendChild(dealerSecondCard);
  } else {
    const temp = "player" + playerIndex + "CardOverall";
    const playerCardOverallElement = document.getElementById(temp);
    for (i = 0; i < cards.length; i++) {
      const singleCard = document.createElement("img");
      singleCard.className = "singleCardStyle";
      const suitsNum = randomCardSuitNumber();
      singleCard.src = "cardsPics/card" + cards[i] + suitsNum + ".png";
      if (i == 0) {
        singleCard.style.position = "relative";
      } else {
        singleCard.style.position = "absolute";
        singleCard.style.bottom = "20px";
        singleCard.style.left = "15px";
      }
      playerCardOverallElement.appendChild(singleCard);
    }
  }
};

//Render the additional hit cards
const renderAdditionalCard = (indiePlayer) => {
  const { cards, id, playerIndex } = indiePlayer;
  if (id == "dealer" && dealerTurn) {
    const dealerCards = document.getElementById("dealerCards");
    const singleCard = document.createElement("img");
    singleCard.className = "dealerAdditionalCard";
    const suitsNum = randomCardSuitNumber();
    singleCard.src =
      "cardsPics/card" + cards[cards.length - 1] + suitsNum + ".png";
    dealerCards.appendChild(singleCard);
  } else {
    const temp = "player" + playerIndex + "CardOverall";
    const playerCardOverallElement = document.getElementById(temp);
    const singleCard = document.createElement("img");
    singleCard.className = "singleCardStyle";
    const suitsNum = randomCardSuitNumber();
    singleCard.src =
      "cardsPics/card" + cards[cards.length - 1] + suitsNum + ".png";
    singleCard.style.position = "absolute";
    if (indiePlayer.pressDouble) {
      singleCard.style.transform = "rotate(90deg)";
      singleCard.style.bottom = (cards.length - 1) * 30 + "px";
      singleCard.style.left = (cards.length - 1) * 25 + "px";
      indiePlayer.pressDouble = false;
    } else {
      singleCard.style.bottom = (cards.length - 1) * 20 + "px";
      singleCard.style.left = (cards.length - 1) * 15 + "px";
    }
    playerCardOverallElement.appendChild(singleCard);
  }
};

//Render revealed dealer's card
const renderDealerReveal = (indiePlayer) => {
  const { cards } = indiePlayer;
  const container = document
    .getElementById("dealerCards")
    .getElementsByTagName("img");
  const suitsNum = randomCardSuitNumber();
  container[1].src =
    "cardsPics/card" + cards[cards.length - 1] + suitsNum + ".png";
};

//Print out player's total sum info
const renderTotalSum = (indiePlayer) => {
  const { currentSum, id, playerIndex } = indiePlayer;
  if (id !== "dealer") {
    const tempName = "player" + playerIndex + "TotalSumOverall";
    const totalSumOverallElement = document.getElementById(tempName);
    totalSumOverallElement.innerHTML = "";

    if (currentSum.includes(21)) {
      const renderSumChip = document.createElement("div");
      renderSumChip.className = "renderSumChip";

      const blackChips = document.createElement("img");
      blackChips.className = "sumBlackChips";
      blackChips.src = "pokerChips/blackChips2.jpg";
      renderSumChip.appendChild(blackChips);

      const blackChipsSumText = document.createElement("div");
      blackChipsSumText.className = "blackChipsSumText";
      blackChipsSumText.innerText = 21;
      renderSumChip.appendChild(blackChipsSumText);

      totalSumOverallElement.appendChild(renderSumChip);
    } else {
      for (i = 0; i < currentSum.length; i++) {
        const renderSumChip = document.createElement("div");
        renderSumChip.className = "renderSumChip";

        const blackChips = document.createElement("img");
        blackChips.className = "sumBlackChips";
        blackChips.src = "pokerChips/blackChips2.jpg";
        renderSumChip.appendChild(blackChips);

        const blackChipsSumText = document.createElement("div");
        blackChipsSumText.className = "blackChipsSumText";
        blackChipsSumText.innerText = currentSum[i];
        renderSumChip.appendChild(blackChipsSumText);

        if (currentSum[i] > 21) {
          const bustedSumDisplay = document.createElement("div");
          bustedSumDisplay.className = "bustedSumDisplay";
          renderSumChip.appendChild(bustedSumDisplay);
        }

        totalSumOverallElement.appendChild(renderSumChip);
      }
    }
  } else {
    const dealerTotalSumOverallElement = document.getElementById(
      "dealerTotalSumOverall"
    );
    if (dealerTurn) {
      dealerTotalSumOverallElement.innerHTML = "";
    }
    const renderSumChip = document.createElement("div");
    renderSumChip.className = "renderDealerSumChip";

    const blackChips = document.createElement("img");
    blackChips.className = "sumBlackChips";
    blackChips.id = "dealerSumBlackChips";
    blackChips.src = "pokerChips/blackChips2.jpg";
    renderSumChip.appendChild(blackChips);

    const blackChipsSumText = document.createElement("div");
    blackChipsSumText.className = "blackChipsSumText";
    blackChipsSumText.id = "blackChipsSumText";
    if (dealerTurn) {
      blackChipsSumText.innerText = currentSum[0];
    } else if (indiePlayer.cards[0] >= 11) {
      blackChipsSumText.innerText = 10;
    } else {
      blackChipsSumText.innerText = indiePlayer.cards[0];
    }
    renderSumChip.appendChild(blackChipsSumText);
    dealerTotalSumOverallElement.appendChild(renderSumChip);
  }
};

//Darken the cards if busted
const bustedCardDisplay = (indiePlayer) => {
  let tempCard = "";
  if (indiePlayer.id === "dealer" && indiePlayer.currentSum > 21) {
    tempCard = "dealerCards";
    const dealerSumChipsElement = document.getElementById(
      "dealerSumBlackChips"
    );
    dealerSumChipsElement.style.filter = "brightness(30%)";
    const dealerSumChipsText = document.getElementById("blackChipsSumText");
    dealerSumChipsText.style.filter = "brightness(30%)";
  } else {
    tempCard = "player" + indiePlayer.playerIndex + "CardOverall";
  }
  const playerCardElement = document.getElementById(tempCard);
  playerCardElement.style.filter = "brightness(50%)";
};

//Render the game result (resulting money)
const renderFinalAmount = () => {
  playerList.forEach((indiePlayer) => {
    if (indiePlayer.id !== "dealer") {
      const tempPlayerBetAmount = "playerBetAmount" + indiePlayer.playerIndex;
      const tempPlayerMoney = "playerMoney" + indiePlayer.playerIndex;
      const playerBetAmount = document.getElementById(tempPlayerBetAmount);
      const playerMoney = document.getElementById(tempPlayerMoney);
      if (indiePlayer.id !== "dealer") {
        playerBetAmount.innerText = "";
        playerBetAmount.innerText += "$ -----";
        playerMoney.innerText = "";
        playerMoney.innerText += "$" + indiePlayer.totalAmount;
      }
    } else {
      const dealerAreaElement = document.getElementById("dealerArea");
      dealerAreaElement.removeChild(document.getElementById("dealerContinue"));
      const restartBtn = renderRestartButton(indiePlayer);
      dealerAreaElement.appendChild(restartBtn);
    }
  });
};
