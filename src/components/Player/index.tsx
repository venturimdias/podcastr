import { useContext, useRef, useEffect } from 'react';
import Image from 'next/image'
import { PlayerContext } from '../../contexts/PlayerContexts';
import styles from './styles.module.scss';

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)


    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        togglePlay,
        setPlayingState
    } = useContext(PlayerContext)

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }

    },[isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return(
    <div className={styles.container}>
        <header> 
            <img src="/headphone.svg" alt="Tocando agora" />
            <strong>Tocando agora</strong>
        </header>

        { episode ? (
            <div className={styles.currentEpisode}>
                <Image width="592" height="592" src={ episode.thumbnail } objectFit="cover" />
                <strong>{ episode.title }</strong>
                <p>{ episode.members }</p>
            </div>
        ) : (
            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>
        ) }
        

        <footer className={!episode ? styles.empty : '' }>
            <div className={styles.progress}>
                <span>00:00</span>

                <div className={styles.slider}>
                    { episode ? (
                        <Slider 
                            trackStyle={{ backgroundColor: '#74D361' }}
                            railStyle={{ backgroundColor: '#9f75ff' }}
                            handleStyle={{ borderColor: '#74D361', borderWidth: 4 }}
                        />
                    ):(
                        <div className={styles.emptySlider}></div>
                    )}
                </div>

                <span>00:00</span>
            </div>



            <div className={styles.buttons}>
                <button type="button" disabled={!episode} >
                    <img src="/shuffle.svg" alt="Embaralhar" />
                </button>
                <button type="button"  disabled={!episode}>
                    <img src="/play_left.svg" alt="Tocar anterior" />
                </button>
                <button type="button" 
                    className={styles.playButton} 
                    onClick={togglePlay}  
                    disabled={!episode}>
                    { isPlaying 
                        ? <img src="/pause.svg" alt="Tocar próxima" />
                        : <img src="/play.svg" alt="Tocar" /> }
                </button>
                <button type="button"  disabled={!episode}>
                    <img src="/play_right.svg" alt="Tocar próxima" />
                </button>
                <button type="button"  disabled={!episode}>
                    <img src="/repeat.svg" alt="Repetir" />
                </button>
            </div>

            { episode && (
                <audio 
                    src={ episode.url }
                    ref={audioRef}
                    autoPlay
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}

                />
            )}

        </footer>
    </div>
    )
}