import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../../services/api'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContexts'

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}
type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode } : EpisodeProps){

    const { play, isModoBlack } = usePlayer()

    return (
        <div className={[styles.episodio, isModoBlack ? styles.modoBlack : ''].join(' ')}>
        <Head>
            <title> {episode.title} | Podcastr</title>
        </Head>
        <div className={styles.container}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                <button type="button">
                    <img src="/arrow-left.svg" alt="voltar" />
                </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
                <button type="button" onClick={ () => play(episode) }>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{ episode.members }</span>
                <span>{ episode.publishedAt }</span>
                <span>{ episode.durationAsString }</span>
            </header>

            <div className={styles.desc}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
        </div>
    )
}

/* Metodos obrigatórios para rotas dinâmica */
/* 
    fallback 
    false - retornar 404 caso não exista o slug no paths
    true - buscar o conteudo para criar em disco e a chamada é no cliente (browser)
    ------ Ncessário usar o useRoute para saber se o contudo esta carregando
    const router = useRouter()
    if(router.isFallback){
        return <p>Carregando...</p>
    }

    Melhor opção
    'blocking' - Next.js roda em dois ambientes (Cliente: browser | next.js: node.js ) 
    busca o contudo na camada do node.js - PS: 3ª camada >  server : back-end  
*/
export const getStaticPaths : GetStaticPaths = async () => {
    const { data } = await api.get('episodes',{
        params:{
          _limit:2,
          _sort:'published_at',
          _order:'desc'
        }
      })

      const paths = data.map(episode => {
          return{
              params:{
                  slug: episode.id
              }
          }
       })

    return{
        paths,
        fallback: 'blocking'
    }    
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
    // esse slug é o nome do arquivo [slug].tsx
    const { slug } = ctx.params

    const { data } = await api.get(`/episodes/${slug}`)

    console.log(data)
    const episode = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            members: data.members,
            publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
            duration: Number(data.file.duration),
            durationAsString: convertDurationToTimeString(Number(data.file.duration)), 
            description: data.description,
            url: data.file.url,
        }

    return{
        props:{
            episode
        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}