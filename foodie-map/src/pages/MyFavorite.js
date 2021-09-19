import { useState, useEffect } from "react";
import Categories from "../components/data/Categories";
import Sidebar from "../components/ui/Sidebar";
import Gallery from "../components/ui/Gallery";

function MyFavorite() {
  const [isLoadingRestaurants, setIsLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [photoURLs, setPhotoURLs] = useState(null);

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
          if (restaurant.favourite) restaurants.push(restaurant);
        }
        return restaurants;
      })
      .then((data) => {
        const collections = [];
        Categories.map((category) => {
          const title = category.title;
          const collection = {
            category: title,
            members: data.filter((member) => member.category === title),
          };
          collections.push(collection);
        });
        setCollections(collections);
        console.log(collections);
        setIsLoading(false);
      });
  }, []);

  function showGallery(photoURLs) {
    console.log(photoURLs);
    setPhotoURLs(photoURLs);
  }
  if (isLoadingRestaurants) return "Loading";
  return (
    <section>
      <div>
        <Sidebar collections={collections} showGallery={showGallery} />
        {photoURLs ? <Gallery photoURLs={photoURLs}></Gallery> : null}
      </div>
    </section>
  );
}

export default MyFavorite;
