import React, {useState, useEffect} from "react";

import { CssBaseline, Grid } from "@material-ui/core";

import { getPlacesData, getWeatherData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";
import Map from "./components/Map/Map";



const App =()=>{
    const [places, setPlaces]= useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [childClicked, setChildClicked] = useState(null);
    const [coordinates, setCoordinates]= useState({});
    const [bounds, setBounds] = useState(null);
    const [isLoading, setIsLoading]= useState(false);
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);

    const onPlaceChanged = ()=>{
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();
    
        setCoordinates({ lat, lng });
    }
    const onLoad = (autoC)=>setAutocomplete(autoC);

    useEffect (()=>{
        navigator.geolocation.getCurrentPosition(({coords : {latitude, longitude}})=> {
           setCoordinates({lat: latitude, lng: longitude});
        });
    }, []);

    useEffect(()=>{
         const filteredPlaces = places.filter((place)=> place.rating> rating);
         setFilteredPlaces(filteredPlaces);
        }, [rating])

    
    useEffect(() => {
        if (bounds) {
            setIsLoading(true);

            getWeatherData(coordinates.lat, coordinates.lng)
            .then((data)=>setWeatherData(data));

            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    console.log(data);
                    setPlaces(data.filter((place)=>place.name && place.num_reviews > 0));
                    setFilteredPlaces([]);
                    setRating('');
                    setIsLoading(false);
                });
        }
    }, [type, bounds]);

    
    

    return(
        <>
           <CssBaseline/>
           <Header setCoordinates={setCoordinates} onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
           <Grid container spacing={3} style={{width: '100%' }}>
            <Grid item xs={12} md={4}>
              <List places= {filteredPlaces.length ? filteredPlaces : places}
                    childClicked={childClicked}
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
                    setBounds = {setBounds}
                    coordinates={coordinates}  
                    places={filteredPlaces.length ? filteredPlaces : places} 
                    setChildClicked={setChildClicked}
                    weatherData={weatherData}
                />
            </Grid>
           </Grid>
        </>
    );
}

export default App;