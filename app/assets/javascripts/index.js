$(document).ready(function(){


  var geocoder;


  //Get the latitude and the longitude;
  function successFunction(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      getState(lat, lng)
  }

  function errorFunction(){
      alert("Geocoder failed");
  }

  function initialize() {
    geocoder = new google.maps.Geocoder();
  }

  function getState(lat, lng){
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      var shortState = results[3].address_components[1].short_name
      $.ajax({
        "url": '/getdata',
        "method": "get",
        "data":{state: shortState}
      }).done(function(data){
        console.log(data)
        findCloseRaces(data)
      })
    })
  }

  function findCloseRaces(data){
    $(data).each(function(index, val){
      moe = val.questions[0].subpopulations[0].margin_of_error
      var candidates = val.questions[0].subpopulations[0].responses
      var percents = []
      $(candidates).each(function(index, val){
        percents.push(val.value)
      })
      if(twoHighest(percents) < moe){
        console.log("it's a nail biter!")
      }
      else{
        console.log('what a snorefest')
      }

    })
  }

  function twoHighest(arr){
    biggest = -Infinity,
    next_biggest = -Infinity;
    for (var i = 0, n = arr.length; i < n; ++i) {
    var nr = +arr[i]; // convert to number first

    if (nr > biggest) {
        next_biggest = biggest; // save previous biggest value
        biggest = nr;
    }
    else if (nr < biggest && nr > next_biggest) {
        next_biggest = nr; // new second biggest value
      }
    }
    return(biggest - next_biggest)
  }

  $('#test').on('click', function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }
  })
  initialize()
})
