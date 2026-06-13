import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pan from './Pan'

const RecipeSingle = () => {


  const [recipes, setRecipes] = useState([])
  const [errors, setErrors] = useState(false)
  const [youTubeLink, setYouTubeLink] = useState('')
  const { idMeal } = useParams()

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        setRecipes(data.meals[0])
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    if (recipes.strYoutube) {
      console.log('yt link', (recipes.strYoutube).slice(-11))
      setYouTubeLink(`https://www.youtube.com/embed/${(recipes.strYoutube).slice(-11)}`)
    }
  }, [recipes])

  console.log('entries', Object.entries(recipes))
  
  const entries = Object.entries(recipes)
  const ingredients = []
  const measurements = []
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][0].includes('strIngredient') && entries[i][1]) {
      ingredients.push(entries[i][1].toLowerCase())
    }
  }
  let count = 0
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][0].includes('strMeasure') && entries[i][1] && ingredients[count]) {
      measurements.push(` ${entries[i][1].toLowerCase()}`.concat(` ${ingredients[count]} `))
      console.log(ingredients[count])
      count++
    }
  }
  console.log('ingredients->', ingredients)
  console.log('measurements->', measurements)
  console.log('entries->', entries)
  console.log('recipes->', recipes)
  
  return (
    <Container as="main" >
      {entries.length > 0
        ?
        <>
          <Row className='top-row'>
            <Col>
              <div className='bg-img'style={{ backgroundImage: `url(${recipes.strMealThumb})` }}>
                <h1 className='text-center mx-auto'>{recipes.strMeal}</h1>
              </div>
            </Col>
          </Row>
          <Row className='middle-row'>
            <Col key={idMeal} md="3">
              <div>
                <h2>Ingredients</h2>
                {measurements.map(item => {
                  return (<div className='recipeSingleIngredients' key={item}> {item} </div>)
                })
                }
              </div>
            </Col>
            <Col>
              <h2 className='text-center'>Directions</h2>
              <div>{recipes.strInstructions}</div>
            </Col>
          </Row>
          <Row className='bottom-row'>
            <iframe width="560" height="450" src={youTubeLink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </Row>
        </>
        :
        <>
          {errors ? <h2>Something went wrong. Please try again later</h2> : <Pan />}
        </>
      }
    </Container >
  )
}

export default RecipeSingle