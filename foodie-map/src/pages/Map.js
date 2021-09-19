import { useState, useEffect, useCallback, useRef } from "react";
import MapStyle from "../components/layout/MapStyle";
import Modal from "../components/layout/Modal";
import Backdrop from "../components/layout/Backdrop";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import classes from "./Map.module.css";
import * as AiIcons from "react-icons/ai";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "90vh",
  top: "10vh",
};
const center = {
  lat: 49.2827,
  lng: -123.1207,
};
const options = {
  styles: MapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [isLoadingRestaurants, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState();

  function showModalHandler() {
    setShowModal(true);
  }

  function closeModalHandler() {
    setShowModal(false);
  }

  function addRestaurantHandler(restaurant) {
    fetch(`${process.env.REACT_APP_FIREBASE_URL}/restaurants.json`, {
      method: "POST",
      body: JSON.stringify(restaurant),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        restaurant.id = data.name;
        console.log(restaurant);
        setSelected(restaurant);
      });
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_FIREBASE_URL}/restaurants.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const restaurants = [];
        for (const key in data) {
          const restaurant = {
            id: key,
            ...data[key],
          };
          restaurants.push(restaurant);
        }
        setIsLoading(false);
        setRestaurants(restaurants);
        console.log(restaurants);
      });
  }, []);

  const addRestaurant = useCallback((restaurantData) => {
    if (
      !restaurants.some(
        (restaurant) => restaurant.place_id === restaurantData.place_id
      )
    ) {
      setRestaurants((current) => [...current, restaurantData]);
      addRestaurantHandler(restaurantData);
    }
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  });

  const zoomTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded || isLoadingRestaurants) return "Loading map";
  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <h1 className={classes.logo}>
          Foodie Map
          <span role="img" aria-label="rice-ball">
            🍙
          </span>
        </h1>
        <Search zoomTo={zoomTo} addRestaurant={addRestaurant} />
        <Locate zoomTo={zoomTo} />
        {restaurants.map((marker) => (
          <Marker
            key={marker.place_id}
            position={{ lat: marker.position.lat, lng: marker.position.lng }}
            address={marker.address}
            icon={{
              url: "/food.svg",
              scaledSize: new window.google.maps.Size(15, 15),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(0, 0),
            }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{
              lat: selected.position.lat,
              lng: selected.position.lng,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h1>{selected.title}</h1>
              <p>{selected.address}</p>
              <p>
                Spotted {formatRelative(new Date(selected.time), new Date())}
              </p>
              {selected.favourite ? (
                <AiIcons.AiFillHeart
                  onClick={showModalHandler}
                  className={classes.likebtn}
                />
              ) : (
                <AiIcons.AiOutlineHeart
                  className={classes.likebtn}
                  onClick={showModalHandler}
                />
              )}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
      {showModal && <Backdrop onClick={closeModalHandler} />}
      {showModal && <Modal restaurant={selected} onClose={closeModalHandler} />}
    </div>
  );
}

function Locate({ zoomTo }) {
  return (
    <button
      className={classes.locate}
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            zoomTo(pos);
          },
          () => null,
          options
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}

function Search(props) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 49.2827, lng: () => -123.1207 },
      radius: 200 * 1000,
    },
  });
  return (
    <div className={classes.search}>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            const photoURLs = [];
            const request = {
              placeId: results[0].place_id,
              fields: ["photos"],
            };
            const map = new window.google.maps.Map(
              document.createElement("div")
            );
            const googlePlaces = new window.google.maps.places.PlacesService(
              map
            );
            googlePlaces.getDetails(request, (place, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                place &&
                place.photos
              ) {
                for (let i = 0; i < 10; i++) {
                  photoURLs.push(
                    place.photos[i].getUrl({ maxWidth: 400, maxHeight: 400 })
                  );
                }
              }
            });
            const restaurantData = {
              id: null,
              place_id: results[0].place_id,
              position: { lat, lng },
              address: results[0].formatted_address,
              title: address.substr(0, address.indexOf(",")),
              time: new Date(),
              favourite: false,
              category: "",
              photoURLs: photoURLs,
            };
            props.zoomTo({ lat, lng });
            props.addRestaurant(restaurantData);
          } catch (error) {
            console.log("error!");
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default Map;
