import react, { useState, useEffect } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'

import { getPlacesData, getWeatherdata } from './api'
import Header from "./components/Header/Header"
import List from "./components/List/List"
import Map from "./components/Map/Map"

const App = () => {

  const [places, setPlaces] = useState([]);
  const [childClick, setChildClick]=useState(null); 
  const [coordinates, setCoordinates] = useState({})
  const [bounds, setBounds] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType]=useState('restaurants')
  const [rating,setRating]=useState('')
  const [filteredPlaces,setFilteredPlaces] = useState([]);
  const [weatherData, setWeatherData]= useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude })
    })
  }, [])

  useEffect(()=>{
    const filterPlaces = places.filter(()=> places.rating > rating)
    setFilteredPlaces(filterPlaces)
  },[rating])
 
  useEffect(() => {
  if(bounds.sw && bounds.ne){
    setIsLoading(true)

    getWeatherdata(coordinates.lat, coordinates.lng)
    .then((data)=> setWeatherData(data))

    getPlacesData(type, bounds.sw, bounds.ne)
      .then((data) => {
        setPlaces(data?.filter((place)=> place.name && place.num_reviews >0));
        setFilteredPlaces([])
        setIsLoading(false)
      }) 
  }
  }, [type, bounds]);

 

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }} >
        <Grid item xs={12} md={4}>
          <List 
          places={filteredPlaces.length ? filteredPlaces : places} 
          childClick={childClick} 
          isLoading={isLoading}
          type={type}
          setType={setType}
          rating={rating}
          setRating={setRating}
          />
          
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClick={setChildClick}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>

    </>
  )
}

export default App;
