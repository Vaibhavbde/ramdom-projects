import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RandomPage = () => {

  const navigate = useNavigate()

  const [ idMeal, setIdMeal ] = useState(0)
  const [ strCategory, setStrCategory] = useState('')
  const [ errors, setErrors ] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('https://themealdb.com/api/json/v1/1/random.php')
        setIdMeal(data.meals[0].idMeal)
        setStrCategory(data.meals[0].strCategory)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getData()
  }, [])

  console.log('idMeal', idMeal)
  console.log('strCategory', strCategory)


  useEffect(() => {
    if (strCategory && idMeal) {
      navigate(`/a/${strCategory}/${idMeal}`)
    }
  },[strCategory, idMeal])
 
}

export default RandomPage 