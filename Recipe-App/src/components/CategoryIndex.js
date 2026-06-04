import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Pan from '../components/Pan'

const CategoryIndex = () => {

  const [ categories, setCategories ] = useState([])
  const [ errors, setErrors ] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('https://themealdb.com/api/json/v1/1/categories.php')
        setCategories(data.categories)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])


  return (
    <Container as="main" className='CategoryIndex text-center'>
      <h1 className='mb-4'>Recipe Categories</h1>
      <Row>
        {categories.length > 0
          ?
          categories.map(category => {
            const { idCategory, strCategory, strCategoryThumb } = category
            console.log('strCategory', strCategory)
            return (
              <Col key={idCategory}  md="2" className='mb-4'>
                <Link to={`/a/${strCategory}`}>
                  <Card>
                    <Card.Img variant='top' src={strCategoryThumb}></Card.Img>
                    <Card.Body>
                      <Card.Title className='text-center mb-0 btn'> {strCategory} </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            )
          })
          :
          <>
            {errors ? <h2>Something went wrong. Please try again later</h2> : <Pan />}
          </>
        }
      </Row>
    </Container >
  )
}

export default CategoryIndex