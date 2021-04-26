import Link from 'next/link'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss';
import { usePlayer } from '../../contexts/PlayerContexts';

export default function Header(){
    const currentDate = format(new Date(), 'EEEEEE, d MMM', { locale: ptBR });

    const {isModoBlack, toggleModoBlack} = usePlayer()

    return(
        <header className={[ styles.container, isModoBlack ? styles.modoBlack : '' ].join(' ')} >
            <Link href="/">
                <a><img src={ !isModoBlack ? '/logo.svg' : '/logo-black.svg' } alt="Podcastr" /></a>
            </Link>
            <p>O melhor para você ouvir, sempre</p>

             <button onClick={ toggleModoBlack } >
                 { isModoBlack ? (
                     <i className="fas fa-sun"></i>
                 ):(
                    <i className="fas fa-moon"></i>
                 )}
             </button>   
            <span>{currentDate}</span>
        </header>
    )
}