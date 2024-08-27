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
  padding: 5px;
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  backdrop-filter: blur(20px);
  top: 0;
  left: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
`;

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 10px;
  & > img {
    height: 100%;
  }
`;

const ProgressBarContainer = styled.div`
  width: 280px; /* Adjust width as needed */
  height: 15px; /* Adjust height as needed */
  background-color: #8e9093; /* Default background color */
  display: flex;
  margin-left: 65px; /* Move it to the right */
`;

const ProgressBarFill = styled.div`
  background-color: #58585a;
  width: 50%; /* 50% width to fill half of the bar */
  height: 100%;
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

    // Randomly pick an image and push it to the shuffledImages array
    for (let i = 0; i < 10; i++) { // Adjust the number 10 to however many images you want to display
      const randomIndex = Math.floor(Math.random() * images.length);
      shuffledImages.push(images[randomIndex]);
    }

    setFightImages(shuffledImages);
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Logo to="/">
            <img alt="Gamba logo" src="/logo.png" />
          </Logo>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Latest Fights</div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {fightImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="fight"
                style={{ height: '30px', width: 'auto' }} // Use 'auto' for width to maintain aspect ratio
              />
            ))}
            <ProgressBarContainer>
              <ProgressBarFill />
            </ProgressBarContainer>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
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
        </div>
      </StyledHeader>
    </>
  );
}
