const airportList = require('./airports.json')
const haversine = require('haversine')

function findClosest(airports) {

  const result = {
    // 'example-airport1': [
    //   {
    //     airport: 'a1',
    //     distance: '50'
    //   }
    //   {
    //     airport: 'a2',
    //     distance: '40'
    //   }
    //   {
    //     airport: 'a3',
    //     distance: '500'
    //   }
    // ]
  };

  // For each airport, loop through all other airports and find the 3 closest
  for (let i = 0; i < airports.length; i++) {
    const srcA = airports[i];
    for (let o = 0; o < airports.length; o++) {
      const targetA = airports[o];

      // Don't compare an airport to itself
      if (srcA.LocationID === targetA.LocationID) {
        continue;
      }

      const start = { latitude: srcA.Lat, longitude: srcA.Lon }
      const end = { latitude: targetA.Lat, longitude: targetA.Lon }
      const distance = haversine(start, end); // output in KM by default

      // Don't consider airports greater than 500km away
      if (distance > 500) {
        continue;
      }

      const newAirport = {
        airport: targetA.LocationID,
        distance: distance
      };
      let closestAirports = result[srcA.LocationID]

      // Initialize map entry if not created yet for this src airport
      if (!closestAirports)  {
        closestAirports = [ newAirport ]
      } else {
        // If less than 3 closest aiports found for this src
        if (closestAirports.length < 3) {
          closestAirports.push(newAirport);
        } else {
          // Loop through this src airport's closest list and replace the first
          // one that is farther than the one currently being compared
          for (let e = 0; e < closestAirports.length ; e++) {
            if (distance < closestAirports[e].distance) {
              closestAirports[e] = newAirport;
              break;
            }
          }
        }
      }
      result[srcA.LocationID] = closestAirports;

    }
  }
  return result;
}


// Run
console.log(findClosest(airportList));
