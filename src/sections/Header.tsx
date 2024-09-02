import { GambaUi, TokenValue, useCurrentPool, useGambaPlatformContext, useUserBalance } from 'gamba-react-ui-v2';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from '../components/Modal';
import TokenSelect from './TokenSelect';
import { UserButton } from './UserButton';
import chicken1 from './chicken1.png';
import chicken2 from './chicken2.png';

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  color: #003c00;
  border-radius: 10px;
  background: #03ffa4;
  padding: 2px 10px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background .2s;
  &:hover {
    background: white;
  }
`;

const AirdropButton = styled.button`
  all: unset;
  cursor: pointer;
  color: black;
  border-radius: 2px;
  background: #E8A63A;
  padding: 10px;
  font-size: 20px;
  text-transform: uppercase;
  position: relative;

  &:hover::after {
    content: 'Coming Soon';
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 3px;
    font-size: 15px;
    white-space: nowrap;
    z-index: 1000;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 20px;
  background: #272E34;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
`;

const Logo = styled(NavLink)`
  height: 35px;
  margin-right: 20px;
  flex-shrink: 0;
  & > img {
    height: 100%;
  }
`;

const ProgressBarContainer = styled.div`
  width: 280px;
  height: 18px;
  background-color: #E1F7FD;
  display: flex;
  position: relative;
  flex-shrink: 0;
  overflow: hidden; /* Ensure the content doesn't overflow the container */
`;

const ProgressBarFill = styled.div`
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  position: absolute;
  top: 0;
  font-size: 10px;
  color: black;
  font-weight: bold;
  height: 100%;
  display: flex;
  align-items: center;
  /* Adjusted positioning to stay fixed */
  left: 10px; /* For 'Black Cock' */
  &:last-child {
    left: 10px; /* For 'White Cock' */
  }
`;

const FightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  flex-grow: 1;
`;

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background-color: #ccc;
  margin-left: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default function Header() {
  const pool = useCurrentPool();
  const context = useGambaPlatformContext();
  const balance = useUserBalance();
  const [bonusHelp, setBonusHelp] = React.useState(false);
  const [jackpotHelp, setJackpotHelp] = React.useState(false);

  const [fightImages, setFightImages] = React.useState([]);
  const [chicken1Count, setChicken1Count] = React.useState(0);
  const [chicken2Count, setChicken2Count] = React.useState(0);

  // Function to generate a random delay between 2 and 10 seconds
  const getRandomDelay = () => Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;

  // Function to update the images array with a random delay
  const updateFightImages = React.useCallback(() => {
    const images = [chicken1, chicken2];
    const randomIndex = Math.floor(Math.random() * images.length);
    const newImage = images[randomIndex];

    setFightImages((prevImages) => {
      const updatedImages = [newImage, ...prevImages];
      const updatedChicken1Count = updatedImages.filter((img) => img === chicken1).length;
      const updatedChicken2Count = updatedImages.filter((img) => img === chicken2).length;

      setChicken1Count(updatedChicken1Count);
      setChicken2Count(updatedChicken2Count);

      return updatedImages.slice(0, 10); // Ensure the array length remains 10
    });

    // Set a timeout for the next update with a random delay
    setTimeout(updateFightImages, getRandomDelay());
  }, []);

  React.useEffect(() => {
    // Initialize with 10 images
    const images = [chicken1, chicken2];
    const initialImages = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * images.length);
      initialImages.push(images[randomIndex]);
    }
    setFightImages(initialImages);

    // Count initial images
    setChicken1Count(initialImages.filter((img) => img === chicken1).length);
    setChicken2Count(initialImages.filter((img) => img === chicken2).length);

    // Start updating images at random intervals
    setTimeout(updateFightImages, getRandomDelay());

    return () => clearTimeout(updateFightImages); // Clean up on unmount
  }, [updateFightImages]);

  // Calculate the percentages for the progress bar
  const totalImages = 10;
  const chicken1Percentage = (chicken1Count / totalImages) * 100;
  const chicken2Percentage = (chicken2Count / totalImages) * 100;

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays. This bonus will be applied automatically when you play.
          </p>
          <p>Note that a fee is still needed from your wallet for each play.</p>
        </Modal>
      )}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            There{'\''}s <TokenValue amount={pool.jackpotBalance} /> in the Jackpot.
          </p>
          <p>
            The Jackpot is a prize pool that grows with every bet made. As the Jackpot grows, so does your chance of winning. Once a winner is selected, the value of the Jackpot resets and grows from there until a new winner is selected.
          </p>
          <p>
            You will be paying a maximum of {(context.defaultJackpotFee * 100).toLocaleString(undefined, { maximumFractionDigits: 4 })}% for each wager for a chance to win.
          </p>
          <GambaUi.Switch
            checked={context.defaultJackpotFee > 0}
            onChange={(checked) => context.setDefaultJackpotFee(checked ? 0.01 : 0)}
          />
        </Modal>
      )}
      <StyledHeader>
        <Logo to="/">
          <img alt="Gamba logo" src="/logo.png" />
        </Logo>
        <FightContainer>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Latest Fights</div>
          {fightImages.map((image, index) => (
            <img key={index} src={image} alt="fight" style={{ height: '30px', width: 'auto' }} />
          ))}
          <Divider /> {/* Vertical line divider after the fight images */}
        </FightContainer>
        <RightContainer>
          <ProgressBarWrapper>
            <ProgressBarContainer>
              <ProgressBarFill style={{ width: `${chicken1Percentage}%`, backgroundColor: '#E8A63A' }}>
                <Label>Black Cock</Label>
              </ProgressBarFill>
              <ProgressBarFill
                style={{ width: `${chicken2Percentage}%`, backgroundColor: '#FFFFFF', left: `${chicken1Percentage}%` }}
              >
                <Label>White Cock</Label>
              </ProgressBarFill>
            </ProgressBarContainer>
            {pool.jackpotBalance > 0 && (
              <Bonus onClick={() => setJackpotHelp(true)}>
                💰 <TokenValue amount={pool.jackpotBalance} />
              </Bonus>
            )}
          </ProgressBarWrapper>
          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}
          <AirdropButton>AIRDROP</AirdropButton>
          <TokenSelect />
          <UserButton />
        </RightContainer>
      </StyledHeader>
    </>
  );
}
