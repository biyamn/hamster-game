'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const gameTime = 10;
  const [gameStatus, setGameStatus] = useState<'start' | 'playing' | 'end'>('start');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(gameTime);
  const [poops, setPoops] = useState<{ id: number; top: number; left: number }[]>([]);
  const [poopId, setPoopId] = useState(0);
  const [hamsterLeft, setHamsterLeft] = useState(0);
  const [hamsterDirection, setHamsterDirection] = useState(1); // 1: 오른쪽, -1: 왼쪽
  const [inputValue, setInputValue] = useState('');
  const [isInputError, setIsInputError] = useState(false);
  const [ranker, SetRanker] = useState<{ nickname: string; score: number }[]>([]);
  const [maxLeft, setMaxLeft] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMaxLeft(window.innerWidth - 100 - 10); // 100은 햄스터 크기, 10은 여유
    }
  }, []);

  const minLeft = 0;
  const speed = 1.5;

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      if (time < 1) {
        return;
      }
      setHamsterLeft((prev) => {
        let next = prev + speed * hamsterDirection;
        if (next >= maxLeft) {
          setHamsterDirection(-1);
          next = maxLeft;
          return next;
        } else if (next <= minLeft) {
          setHamsterDirection(1);
          next = minLeft;
          return next;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [hamsterDirection, time, maxLeft, gameStatus]);

  useEffect(() => {
    if (gameStatus === 'start') return;
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStatus('end');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [time, gameStatus, score]);

  useEffect(() => {
    if (gameStatus !== 'end') return;

    const fetchData = async () => {
      await fetch('http://localhost:8080/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: inputValue,
          score: score,
        }),
      });

      const res = await fetch('http://localhost:8080/ranking');
      const data = await res.json();
      SetRanker(data);
    };

    fetchData();
  }, [gameStatus, inputValue, score]);

  const handleHamsterClick = () => {
    const newId = poopId + 1;
    setPoopId(newId);
    const poopLeft = hamsterDirection === 1 ? hamsterLeft + 10 : hamsterLeft + 80;
    setPoops((prev) => [...prev, { id: newId, top: 67, left: poopLeft }]);
    setTimeout(() => {
      setPoops((prev) => prev.map((poop) => (poop.id === newId ? { ...poop, top: 400 } : poop)));
    }, 200);
  };

  const handlePoopClick = (id: number) => {
    if (time > 0) {
      setScore((prev) => prev + 1);
      setPoops((prev) => prev.filter((poop) => poop.id !== id));
    }
  };

  const handleStartGame = () => {
    setScore(0);
    setTime(gameTime);
    setGameStatus('start');
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen crayon-font">
        {/* 게임 시작 */}
        {gameStatus === 'start' && (
          <div className="fixed inset-0 flex items-center justify-center z-40">
            {/* 흐릿한 반투명 배경 */}
            <div className="absolute inset-0 bg-amber-50 opacity-50 z-0" />
            {/* UI 내용은 완전히 보이게 배경 위에 표시 */}
            <form
              onSubmit={(e) => {
                e.preventDefault(); // 브라우저 기본 새로고침 방지
                if (inputValue.trim().length <= 1) {
                  setIsInputError(true);
                } else {
                  setGameStatus('playing');
                }
              }}
              className="z-10 flex flex-col items-center bg-white px-8 py-6 rounded shadow-lg"
            >
              <label htmlFor="name" className="mb-2 text-lg text-black">
                닉네임을 입력하세요 :
              </label>

              <input type="text" name="name" id="name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} required minLength={1} maxLength={20} className="p-2 rounded text-gray-800 border text-lg" />
              {isInputError && <p className="text-red-600 text">* 공백 제외 한글자 이상 입력해 주세요.</p>}
              <button type="submit" className="cursor-pointer mt-4 px-4 py-2 bg-blue-500 text-white rounded text-lg">
                게임 시작
              </button>
            </form>
          </div>
        )}

        {/* 게임 끝 */}
        {gameStatus === 'end' && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* UI 내용은 완전히 보이게 배경 위에 표시 */}
            <div className="flex flex-col items-center bg-white px-8 py-6 rounded shadow-lg">
              <div className="text-3xl font-bold">축하합니다, {score}점입니다!</div>
              <div>
                {ranker.map((r, i) => (
                  <div key={i}>
                    {i + 1}위 - {r.nickname} : {r.score}점
                  </div>
                ))}
              </div>
              <button className="cursor-pointer mt-4 px-4 py-2 bg-blue-500 text-white rounded text-2xl" onClick={handleStartGame}>
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end w-full text-xl text-rose-500 mt-5 mb-2 mr-10">{score}점</div>
        <div className="flex justify-end w-full text-xl text-slate-900 mb-4 mr-10">{time}초</div>
        <div className="flex">
          <div className="relative flex justify-end" style={{ width: windowWidth, height: 120 }}>
            <img
              onClick={handleHamsterClick}
              src="/assets/hamster.png"
              alt="hamster"
              width={100}
              height={100}
              className="cursor-pointer"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: hamsterDirection === 1 ? `translateX(${hamsterLeft}px) scaleX(1)` : `translateX(${hamsterLeft}px) scaleX(-1)`,
                transition: 'transform 0.1s linear',
                zIndex: 10,
                willChange: 'transform',
              }}
            />
            {poops.map((poop) => (
              <img
                key={poop.id}
                src="/assets/poop.png"
                alt="poop"
                width={15}
                height={15}
                onClick={() => handlePoopClick(poop.id)}
                className="cursor-pointer"
                style={{
                  position: 'absolute',
                  left: 0,
                  transform: `translateX(${poop.left}px)`,
                  top: poop.top,
                  transition: 'top 0.51s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                  zIndex: 5,
                  willChange: 'transform',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
