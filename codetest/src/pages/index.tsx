import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import {NewsActicle, NewsResponse} from '@/models/NewsActicle'
import { GetServerSideProps } from 'next'
import NewsArticleEntry from '@/components/NewsArticleEntry'
import NewsArticleGrid from '@/components/NewsArticleGrid'
import { Alert } from 'react-bootstrap'

 interface BreakingNewsPageProps {
  newArticles: NewsActicle[]
 }

 export const getServerSideProps: GetServerSideProps<BreakingNewsPageProps> = async () => {

  const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey="+process.env.NEWS_API_KEYS)
  const newsResponse: NewsResponse = await response.json()
  return {
    props : {newArticles: newsResponse.articles}
  }
 }

export default function BreakingNewsPage({newArticles}: BreakingNewsPageProps) {
  return (
    <>
    <Head>
      <title key='title'>Breaking News</title>
    </Head>
    <main>
     <h1>Breaking News</h1>
 
     <NewsArticleGrid articles={newArticles}/>
    </main>
    </>
    
  )
}
