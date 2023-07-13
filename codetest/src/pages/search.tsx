import NewsArticleGrid from '@/components/NewsArticleGrid'
import {NewsActicle} from '@/models/NewsActicle'
import { Head } from 'next/document'
import {FormEvent, useState} from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'

const searchNewsPage = () => {
    const [searchResults, setsearchResults] = useState<NewsActicle[] | null>(null)
    const [searchResultsLoading, setsearchResultsLoading] = useState(false) 
    const [searchResultsLoadingIsError, setsearchResultsLoadingIsError] = useState(false )
  
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
       e.preventDefault()
       const formData = new FormData(e.target as HTMLFormElement)
       const searchQuery = formData.get('searchQuery')?.toString().trim() 
       if(searchQuery){
        try {
            setsearchResults(null)
            setsearchResultsLoadingIsError(false)
            setsearchResultsLoading(true)
            const response = await fetch("/api/search-news?q="+ searchQuery)
            const articles: NewsActicle[] = await response.json()
            setsearchResults(articles)
        } catch (error) {
            console.log(error)
            setsearchResultsLoadingIsError(true)
        }finally{
            setsearchResultsLoading(false)
        }
       }
    }
    return ( 
        
   
        <main>
            <h1>Search News</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='search-input'>
                    <Form.Label>Search query</Form.Label>
                    <Form.Control
                    name='searchQuery'
                    placeholder='E.g. sport, politics, ...'
                    />
                </Form.Group>
                <Button type="submit" className='mb-3' disabled={searchResultsLoading}>
                    Search
                </Button>
            </Form>
            <div className="d-flex flex-column align-items-center">
                    {searchResultsLoading && <Spinner animation="border" />}
                    {searchResultsLoadingIsError && <p>Something went wrong. Please try again.</p>}
                    {searchResults?.length === 0 && <p>Nothing found. Try a different query!</p>}
                    {searchResults && <NewsArticleGrid articles={searchResults} />}
                </div>
        </main>
       
     );
}
 
export default searchNewsPage;