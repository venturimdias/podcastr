import { useContext, createContext, useState, ReactNode } from 'react'

type Episode = {
    title: string;
    members:string;
    thumbnail:string;
    duration: number;
    url: string;
}
type PlayerContextData ={
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isShuffling: boolean;
    isLooping: boolean;
    hasPrev: boolean;
    hasNext: boolean;
    isActivePlayer:boolean;
    isModoBlack: boolean;
    setPlayingState: (state : boolean) => void;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playPrev: () => void;
    playNext: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState:()=>void;
    toggleActivePlayer: () => void;
    toggleModoBlack: () => void;
}
export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode;
}
export function PlayerContextProvider({ children } : PlayerContextProviderProps){
    const [ episodeList, setEpisodeList ] = useState([])
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [ isLooping, setIsLooping ] = useState(false)
    const [ isShuffling, setIsShuffling ] = useState(false)

    const [ isActivePlayer, setIsActivePlayer ] = useState(false)
    const [ isModoBlack, setIsModoBlack ] = useState(false)


    function play(episode : Episode){
      setEpisodeList([episode])
      setCurrentEpisodeIndex(0)
      setIsPlaying(true)
    }
    function playList(list: Episode[], index: number){
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }
    function togglePlay(){
      setIsPlaying(!isPlaying)
    }
    function toggleLoop(){
        setIsLooping(!isLooping)
    }
    function toggleShuffle(){
        setIsShuffling(!isShuffling)
    }
    function setPlayingState(state: boolean){
        setIsPlaying(state)
    }
    function clearPlayerState(){
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    function toggleActivePlayer(){
        setIsActivePlayer(!isActivePlayer)
    }

    function toggleModoBlack(){ 
        //let localStoregeModoBlack = localStorage.getItem('modoBlack')
        
        if(!isModoBlack){
            window.localStorage.setItem('modoBlack', "1")
        }else{
            window.localStorage.removeItem("modoBlack")
        }
        
        setIsModoBlack(!isModoBlack)
    }

    const hasPrev = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    // tocar proximo
    function playNext(){
        if(isShuffling){
            const nextRandowEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex( nextRandowEpisodeIndex )
        }else if( hasNext ){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    // tocar anterior
    function playPrev(){  
        if( hasPrev ){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    return (
        <PlayerContext.Provider value={{ 
          episodeList, 
          currentEpisodeIndex, 
          play, 
          playList,
          playPrev,
          playNext,
          hasPrev,
          hasNext,
          isPlaying, 
          isLooping, 
          isShuffling,
          isActivePlayer,
          isModoBlack,
          togglePlay,
          toggleLoop,
          toggleShuffle,
          setPlayingState,
          clearPlayerState,
          toggleActivePlayer,
          toggleModoBlack
        }}>
            { children }
        </PlayerContext.Provider>
      )
}

export const usePlayer = () => { 
    return useContext(PlayerContext)
 }