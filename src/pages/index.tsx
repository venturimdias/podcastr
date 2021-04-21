import { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api'

import convertDurationToTimeString from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

//pode ser usada tbm interface
type Episodes = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}
type HomeProps = {
  //Pode ser usada desta forma
  //episodes: Array<Episodes>
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];

}

export default function Home({ latestEpisodes, allEpisodes } : HomeProps) {

  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode =>{
             return(
              <li key={episode.id}>
                   <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit='cover' 
                   />
                  
                    <div className={styles.details}>
                      <Link href={`/episode/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                      <p>{episode.members}</p>
                      <span>{ episode.publishedAt }</span>
                      <span>{ episode.durationAsString }</span>
                    </div>
                    <Link href={`/episode/${episode.id}`}>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                    </Link>
              </li>
             ) 
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcastr</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
          {allEpisodes.map(episode =>{
             return(
              <tr key={episode.id}>
                <td>
                  <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                </td>
                <td>
                  <Link href={`/episode/${episode.id}`}>
                  <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td className={styles.published}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <Link href={`/episode/${episode.id}`}>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                  </Link>
                </td>
                 
              </tr>
             ) 
          })}
          </tbody>
        </table>

        
      </section>
    </div>
  )
}

export  const  getStaticProps: GetStaticProps = async() => {
	const { data } = await api.get('episodes',{
    params:{
      _limit:12,
      _sort:'published_at',
      _order:'desc'
    }
  })

  const episodes = data.map(episode =>{
    return{
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)), 
        description: episode.description,
        url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2, episodes.length);

	return{
		revalidate: 60 * 60 * 8,
		props:{
			latestEpisodes,
      allEpisodes
		}
	}
}