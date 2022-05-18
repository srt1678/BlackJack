//Render player's hit button
const renderHitButton = (indiePlayer) => {
  const hitButton = document.createElement("button");
  hitButton.className = "hitButtonDisplay";
  hitButton.innerText = "Hit";
  hitButton.onclick = hitCard(indiePlayer.cards, indiePlayer);
  return hitButton;
};

//Render player's stand button
const renderStandButton = (indiePlayer) => {
  const standButton = document.createElement("button");
  standButton.className = "standButtonDisplay";
  standButton.innerText = "Stand";
  standButton.onclick = stand(indiePlayer);
  return standButton;
};

//Render player's double button
const renderDoubleButton = (indiePlayer) => {
  const doubleButton = document.createElement("button");
  doubleButton.className = "doubleButtonDisplay";
  doubleButton.innerText = "Double";
  doubleButton.onclick = doubleBets(indiePlayer);
  return doubleButton;
};

//Render dealer's continue button
const renderDealerButton = (indiePlayer) => {
  const dealerButton = document.createElement("button");
  dealerButton.className = "dealerButtonOverall";
  dealerButton.id = "dealerContinue";
  dealerButton.innerText = "Continue";
  dealerButton.onclick = dealerCard(indiePlayer);
  return dealerButton;
};

//Render restart button
const renderRestartButton = () => {
  const restartBtn = document.createElement("button");
  restartBtn.className = "dealerButtonOverall";
  restartBtn.innerText = "Restart";
  restartBtn.onclick = resetGameSetting;
  return restartBtn;
};
