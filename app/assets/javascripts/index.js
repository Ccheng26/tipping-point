$(document).ready(function(){

$('#myCarousel').carousel({
    interval: 1000,
    cycle: true
});
  var geocoder;

//in find close races, grab congressional districts from keys
//find service to convert CD to coordinates/zip code
//run zip code/coords through google maps


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
    var raceType = $('#race-menu')[0].value
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      var shortState = results[3].address_components[1].short_name
      $.ajax({
        "url": '/getdata',
        "method": "get",
        "data":{state: shortState, race: raceType.toLowerCase()}
      }).done(function(data){
        console.log(data)
        groupRaces(data, shortState, raceType)
      })
    })
  }



  function findCloseRaces(data){
    console.log(data)
    $.each(data, function(key, val){
      var r = arrAv(val.r)
      var d = arrAv(val.d)
      var moe = arrAv(val.moe)
      var dem = val.dem
      var rep = val.rep
      console.log(r, d, moe, dem, rep)
      var target =$(".col-md-8")
      // $(target).append("<h3>"+ r + "</h3>")
      $(target).append("<h4>"+ dem + "</h4>")
      $(target).append("<h4>"+ rep + "</h4>")
      $(target).append("<p>"+ moe + "</p>")

      if(Math.abs(r-d)<moe){
        console.log('close')
      }
      else{
        console.log('not close')
      }
    })

    // $(data).each(function(index, val){
    //   var moe;
    //   var candidates
    //   $(val.questions).each(function(index, value){
    //     if(value.state===state&&value.name.includes(race)){
    //       moe = value.subpopulations[0].margin_of_error
    //       candidates = value.subpopulations[0].responses
    //       debugger;
    //     }
    //   })
    //   var percents = []
    //   $(candidates).each(function(index, val){
    //     percents.push(val.value)
    //   })
    //   if(twoHighest(percents) < moe){
    //     console.log("it's a nail biter!")
    //   }
    //   else{
    //     console.log('what a snorefest')
    //   }

    // })
  }

  function groupRaces(data, state, race){
    //call your function here

    var raceHolder = {}
    $(data).each(function(index, val){
      $(val.questions).each(function(index, value){
        if(value.state===state&&value.name.includes(race)){
          if(raceHolder[value.topic]===undefined){
            console.log('undefined key')
            raceHolder[value.topic]={'r':[], 'd':[], 'moe':[]}
            var newObj = raceHolder[value.topic]
            newObj.moe.push(value.subpopulations[0].margin_of_error)
            $(value.subpopulations[0].responses).each(function(index, value){
              if(value.party===null){
                if(value.choice.includes('Dem')||value.choice.includes('(D)')){
                  newObj.d.push(value.value)
                  newObj.dem = value.choice
                }
                else if(value.choice.includes('Rep')||value.choice.includes('(R)')){
                  newObj.r.push(value.value)
                  newObj.rep = value.choice
                }
              }
              else if(value.party.includes('Dem')||value.party.includes('(D)')){
                newObj.d.push(value.value)
                newObj.dem = value.choice
              }
              else if(value.party.includes('Rep')||value.party.includes('(R)')){
                newObj.r.push(value.value)
                newObj.rep = value.choice
              }
            })
          }
          else{
            console.log('defined key')
            var oldObj = raceHolder[value.topic]
            oldObj.moe.push(value.subpopulations[0].margin_of_error)
            $(value.subpopulations[0].responses).each(function(index, value){
              if(value.party===null){
                if(value.choice.includes('Dem')||value.choice.includes('(D)')){
                  oldObj.d.push(value.value)
                }
                else if(value.choice.includes('Rep')||value.choice.includes('(R)')){
                  oldObj.r.push(value.value)
                }
              }
              else if(value.party.includes('Dem')||value.party.includes('(D)')){
                oldObj.d.push(value.value)
              }
              else if(value.party.includes('Rep')||value.party.includes('(R)')){
                oldObj.r.push(value.value)
              }
            })
          }
        }
      })
    })
    findCloseRaces(raceHolder)
  }

  // {"2016 New York CD-19":{'R':[], 'D':[], 'moe':[]}}

  function arrAv(arr){
    var sum = arr.reduce(function(a, b) { return a + b; });
    var avg = sum / arr.length;
    return avg
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
