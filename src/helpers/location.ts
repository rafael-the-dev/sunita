

export const onGettingUserLocation = (func: (latitude: number, longitude: number) => void) => {
    navigator.
        geolocation
        .getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            

           func && func(userLat, userLon)
      });
}