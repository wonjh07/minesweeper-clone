import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  failGame,
  openBtn,
  setFlag,
  setGameState,
  setMineMap,
} from '../store/minesSlice';
import { textColor } from '../styles/theme';
import { FaBomb } from 'react-icons/fa';
import { BsFillFlagFill, BsFlag } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';

const Buttons = () => {
  const mineMap = useAppSelector((state) => state.mines.mineMap);
  const vstMap = useAppSelector((state) => state.mines.vstMap);
  const status = useAppSelector((state) => state.mines.status);
  const dispatch = useAppDispatch();
  const { yNum, xNum } = useAppSelector((state) => state.mines.option);

  const newMinesMap = (yi: number, xi: number) => {
    dispatch(setMineMap({ yi, xi }));
  };

  const openButton = (yi: number, xi: number) => {
    dispatch(openBtn({ yi, xi }));
  };

  const startGame = () => {
    dispatch(setGameState('started'));
  };

  const mineBombs = () => {
    dispatch(failGame());
  };

  const btnFlag = (yi: number, xi: number) => {
    dispatch(setFlag({ yi, xi }));
  };

  // btnPush() : 버튼이 눌리면 실행되는 함수
  const btnPush = (yi: number, xi: number) => {
    // 첫번째 클릭에선 맵을 생성하고 게임이 시작
    if (status === 'idle') {
      newMinesMap(yi, xi);
      startGame();
    }
    // 깃발이 아니거나 열려있지 않은 버튼을 오픈
    if (vstMap[yi][xi] === 0) {
      openButton(yi, xi);
    }
    // 지뢰를 열었을때 게임에 실패
    if (mineMap[yi][xi] === -1) {
      mineBombs();
    }
  };

  const spawnBtn = () => {
    return vstMap.map((y, yi) =>
      y.map((x, xi) => (
        <Button
          key={`${yi} ${xi}`}
          checked={x === 1}
          onContextMenu={(e) => {
            e.preventDefault();
            btnFlag(yi, xi);
          }}
          onClick={() => {
            btnPush(yi, xi);
          }}>
          {x === 1 && (
            <BtnNums style={{ color: textColor(mineMap[yi][xi]) }}>
              {mineMap[yi][xi] > 0 && mineMap[yi][xi]}
              {mineMap[yi][xi] === 0 && null}
              {mineMap[yi][xi] === -1 && (
                <FaBomb size={16} style={{ marginBottom: '3px' }} />
              )}
            </BtnNums>
          )}
          {x === 2 && (
            <Flag>
              <BsFillFlagFill
                size={14}
                style={{ position: 'absolute', color: 'red' }}
              />
              <BsFlag
                size={14}
                style={{ position: 'relative', color: 'black' }}
              />
            </Flag>
          )}
          {x === 3 && (
            <>
              <FaBomb size={16} style={{ marginBottom: '3px' }} />

              <AiOutlineClose
                size={16}
                style={{ position: 'absolute', color: 'red' }}
              />
            </>
          )}
        </Button>
      )),
    );
  };

  return (
    <>
      <GridBox wd={xNum} ht={yNum}>
        {spawnBtn()}
      </GridBox>
    </>
  );
};

export default Buttons;

const GridBox = styled.div<{ wd: number; ht: number }>`
  width: 100%;
  height: 100%;
  display: grid;
  box-sizing: border-box;
  border-bottom: 2px solid #f1f3f4;
  border-right: 2px solid #f1f3f4;
  border-top: 3px solid #606367;
  border-left: 3px solid #606367;
  grid-template-columns: repeat(${(props) => props.wd}, 1.2rem);
  grid-template-rows: repeat(${(props) => props.ht}, 1.2rem);
  grid-gap: 1px;
  background-color: gray;
  border-radius: 1px;
`;

const Button = styled.div<{ checked: boolean }>`
  width: 1.2rem;
  height: 1.2rem;
  background-color: ${(props) => (props.checked ? '#cccccc' : '#B9B9B9')};
  border-radius: ${(props) => (props.checked ? '' : '1px')};
  border-bottom: ${(props) => (props.checked ? '' : '2px solid #606367')};
  border-right: ${(props) => (props.checked ? '' : '2px solid #606367')};
  border-top: ${(props) => (props.checked ? '' : '2px solid #f1f3f4')};
  border-left: ${(props) => (props.checked ? '' : '2px solid #f1f3f4')};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
`;

const BtnNums = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 3px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Flag = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
