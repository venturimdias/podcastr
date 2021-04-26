import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContexts';
import Image from 'next/image'
import styles from './styles.module.scss';

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

export default function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)

   const [ progress, setProgress] = useState(0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        togglePlay,
        setPlayingState,
        playPrev,
        playNext,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
        isShuffling,
        isLooping,
        hasPrev,
        hasNext,
        toggleActivePlayer,
        isActivePlayer,
        isModoBlack
    } = usePlayer()

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

    function setupProgresslistener(){
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }
    function handleSeek(amount:number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }
    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]


    function progressBarLeftHeight(){
        const duration = episode ? episode.duration : 0
        const heightBar = Math.floor(( progress * 100 ) / duration) +"%"
        
        return heightBar
    }
    const progressBarLeftStyle = {
        background: '#54ed35',
        height: progressBarLeftHeight()
    }

    return(
    <div className={[ 
        isActivePlayer ? styles.activePlayer : '',  
        isModoBlack ? styles.modoBlack : '',
        styles.container 
    ].join(' ')}>
        
        <div className={ styles.progressLeft }>
            <div style={ progressBarLeftStyle } />
        </div>

        <header> 
            <img src="/headphone.svg" alt="Tocando agora" />
            <strong>Tocando agora</strong>

            <button onClick={() => toggleActivePlayer()} className={styles.btnActivePlayer}>
                <i className={["fas", isActivePlayer ? "fa-chevron-right" : "fa-chevron-left"].join(' ')}></i>
            </button>
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
                <span>{ convertDurationToTimeString(progress) }</span>

                <div className={styles.slider}>
                    { episode ? (
                        <Slider 
                            max={ episode.duration }
                            value={ progress }
                            onChange={ handleSeek }
                            trackStyle={{ backgroundColor: '#74D361' }}
                            railStyle={{ backgroundColor: '#9f75ff' }}
                            handleStyle={{ borderColor: '#74D361', borderWidth: 4 }}
                        />
                    ):(
                        <div className={styles.emptySlider}></div>
                    )}
                </div>

            <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span> 
            </div>



            <div className={styles.buttons}>
                <button type="button"
                    onClick={ toggleShuffle } 
                    disabled={ !episode || episodeList.length === 1 }
                    className={ isShuffling ? styles.isActive : ''}
                    >
                    <img src="/shuffle.svg" alt="Embaralhar" />
                </button>

                <button type="button" onClick={playPrev}  disabled={!episode || !hasPrev} >
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

                <button type="button" onClick={playNext}  disabled={!episode || !hasNext}>
                    <img src="/play_right.svg" alt="Tocar próxima" />
                </button>

                <button type="button" 
                    onClick={ toggleLoop } 
                    disabled={ !episode }
                    className={ isLooping ? styles.isActive : ''}
                    >
                    <img src="/repeat.svg" alt="Repetir" />
                </button>
            </div>

            { episode && (
                <audio 
                    src={ episode.url }
                    ref={audioRef}
                    autoPlay
                    onEnded={ handleEpisodeEnded }
                    loop={isLooping}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgresslistener}
                />
            )}

        </footer>
    </div>
    )
}