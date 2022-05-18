//Receive random card/number
const addCard = () => {
  return Math.floor(Math.random() * 13) + 1;
};

//Receive random suit number
const randomCardSuitNumber = () => {
  return Math.floor(Math.random() * 4) + 1;
};

//Player hits a card
const hitCard = (cards, indiePlayer) => {
  return () => {
    let { currentSum, bustedArray } = indiePlayer;
    cards.push(addCard());
    currentSum = addSum(cards, currentSum);
    checkSum(currentSum, bustedArray, indiePlayer);
    checkBlackJack(indiePlayer);
    renderAdditionalCard(indiePlayer);
    renderTotalSum(indiePlayer);
    resetButtonView(indiePlayer);
    renderNewerView();
  };
};

//Calculate total sum and add to currentSum array
const addSum = (cards, currentSum) => {
  currentSum.splice(0, currentSum.length);
  let sum = 0;
  let hasOne = cards.includes(1);
  cards.forEach((num) => {
    if (num == 11 || num == 12 || num == 13) {
      sum += 10;
    } else {
      sum += num;
    }
  });
  currentSum.push(sum);
  if (hasOne) {
    currentSum.push(currentSum[0] + 10);
  }
  return currentSum;
};

//check if currentSum is over 21
const checkSum = (currentSum, bustedArray, indiePlayer) => {
  for (i = 0; i < currentSum.length; i++) {
    if (currentSum[i] <= 21) {
      bustedArray[i] = false;
    } else {
      bustedArray[i] = true;
    }
  }
  if (bustedArray.length != 0 && !bustedArray.includes(false)) {
    indiePlayer.isBust = true;
    indiePlayer.gameOver = true;
    if (indiePlayer.id == "dealer") {
      dealerFinish = true;
    } else {
      isFinished[indiePlayer.playerIndex - 1] = true;
      turnCount++;
    }
  }
};

//Play choose to stand, skip and finish
const stand = (indiePlayer) => {
  return () => {
    rotateTurn();
    indiePlayer.gameOver = true;
    isFinished[indiePlayer.playerIndex - 1] = true;
    resetButtonView(indiePlayer);
    renderNewerView();
  };
};

//Double the bets amount
const doubleBets = (indiePlayer) => {
  return () => {
    indiePlayer.pressDouble = true;
    indiePlayer.betAmount *= 2;
    renderDoubleAmount(indiePlayer);
    resetButtonView(indiePlayer);
    renderNewerView();
  };
};

//Calculate the dealer's sum
//First ace has to be 11, the following ace will all be 1
const addDealerSum = (indiePlayer) => {
  let { cards, currentSum, isFirstAce } = indiePlayer;
  dealerSum = 0;
  currentSum.splice(0, currentSum.length);
  let sum = 0;
  cards.forEach((num) => {
    if (num == 11 || num == 12 || num == 13) {
      sum += 10;
    } else if (num == 1) {
      if (isFirstAce) {
        if (sum + 11 <= 21) {
          sum += 11;
        } else {
          sum += 1;
        }
      } else {
        sum += 1;
      }
      isFirstAce = false;
    } else {
      sum += num;
    }
  });
  currentSum.push(sum);
  dealerSum += sum;
  return currentSum;
};

//Hit dealer's card, will hit card if less than or equal to 16
const dealerCard = (indiePlayer) => {
  return () => {
    let { currentSum, bustedArray, cards } = indiePlayer;
    if (currentSum <= 16) {
      cards.push(addCard());
      currentSum = addDealerSum(indiePlayer);
      checkSum(currentSum, bustedArray, indiePlayer);
      checkBlackJack(indiePlayer);
      renderAdditionalCard(indiePlayer);
      renderTotalSum(indiePlayer);
      if (currentSum > 21) {
        bustedCardDisplay(indiePlayer);
      }
    } else {
      dealerFinish = true;
      indiePlayer.gameOver = true;
      finalResult();
    }
  };
};

//Check if play hits BlackJack
const checkBlackJack = (indiePlayer) => {
  const { currentSum } = indiePlayer;
  currentSum.forEach((num) => {
    if (num == 21) {
      indiePlayer.blackJack = true;
      indiePlayer.gameOver = true;
      if (indiePlayer.id !== "dealer") {
        isFinished[indiePlayer.playerIndex - 1] = true;
      } else {
        dealerFinish = true;
      }
    }
  });
};

//Rotate to next player
const rotateTurn = () => {
  if (turnCount == maxPlayerCount) {
    turnCount = 1;
  } else {
    turnCount++;
  }
};

//Calculate the bets results
const finalResult = () => {
  console.log("Printing Result");
  playerList.forEach((indiePlayer) => {
    const { id, isBust, gameOver, blackJack, betAmount, currentSum } =
      indiePlayer;
    if (id !== "dealer") {
      if (isBust && gameOver) {
        indiePlayer.totalAmount -= betAmount;
      } else if (blackJack) {
        indiePlayer.totalAmount += betAmount * 2;
      } else if (dealerSum > 21) {
        if (!isBust && gameOver) {
          indiePlayer.totalAmount += betAmount;
        }
      } else if (!isBust && gameOver) {
        if (
          (currentSum[0] <= 21 && currentSum[0] < dealerSum) ||
          (currentSum[1] <= 21 && currentSum[1] < dealerSum)
        ) {
          indiePlayer.totalAmount -= betAmount;
        } else {
          indiePlayer.totalAmount += betAmount;
        }
      }
    }
  });
  restartGame = true;
  dealerFinish = false;
  renderFinalAmount();
};
