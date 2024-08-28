import { GambaUi, TokenValue, useCurrentPool, useGambaPlatformContext, useUserBalance } from 'gamba-react-ui-v2';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from '../components/Modal';
import TokenSelect from './TokenSelect';
import { UserButton } from './UserButton';
import chicken1 from './chicken1.png'; // Replace with your actual image paths
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
  margin-left: 2%; /* Add space between images and progress bar */
`;

const ProgressBarFill = styled.div`
  background-color: #E8A63A;
  width: 50%;
  height: 100%;
  position: relative;
`;

const Label = styled.span`
  position: absolute;
  top: 0;
  font-size: 10px;
  color: black; /* Set text color to black */
  font-weight: bold;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 5px;
`;

const FightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  flex-grow: 1;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export default function Header() {
  const pool = useCurrentPool();
  const context = useGambaPlatformContext();
  const balance = useUserBalance();
  const [bonusHelp, setBonusHelp] = React.useState(false);
  const [jackpotHelp, setJackpotHelp] = React.useState(false);

  const [fightImages, setFightImages] = React.useState([]);

  React.useEffect(() => {
    const images = [chicken1, chicken2];
    const shuffledImages = [];

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * images.length);
      shuffledImages.push(images[randomIndex]);
    }

    setFightImages(shuffledImages);

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      const newImage = images[randomIndex];

      setFightImages(prevImages => {
        const updatedImages = [newImage, ...prevImages];
        return updatedImages.slice(0, 10); // Keep the array length to 10
      });
    }, 2000); // Update interval set to 2 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays. This bonus will be applied automatically when you play.
          </p>
          <p>
            Note that a fee is still needed from your wallet for each play.
          </p>
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
            <img
              key={index}
              src={image}
              alt="fight"
              style={{ height: '30px', width: 'auto' }}
            />
          ))}
          <ProgressBarContainer>
            <ProgressBarFill>
              <Label style={{ left: '10px' }}>Black Cock</Label>
            </ProgressBarFill>
            <Label style={{ right: '10px' }}>White Cock</Label>
          </ProgressBarContainer>
        </FightContainer>
        <RightContainer>
          {pool.jackpotBalance > 0 && (
            <Bonus onClick={() => setJackpotHelp(true)}>
              💰 <TokenValue amount={pool.jackpotBalance} />
            </Bonus>
          )}
          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}
          <TokenSelect />
          <UserButton />
        </RightContainer>
      </StyledHeader>
    </>
  );
}
