import {NewsActicle} from '@/models/NewsActicle'
import { Row, Col } from 'react-bootstrap';
import NewsArticleEntry from './NewsArticleEntry';



interface NewsArticlePropsGrid {
    articles: NewsActicle[]
}
const NewsArticleGrid = ({articles} :NewsArticlePropsGrid) => {
    return ( 
       <Row xs={1} sm={2} xl={3} className='g-4'> 
        {articles.map( (article, index) =>(
            <Col key={article.url}>
                <NewsArticleEntry article={article}/>
            </Col>
        ))}
       </Row>
     )
}
 
export default NewsArticleGrid;