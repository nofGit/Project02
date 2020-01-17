let relevaneData; 
let ID;
let findKey;
let moreInfo;
let toggleDiv;
let selectedCoins= [];
let coinsToRemove= [];
const allowedCoins = 5 ;
let lastCoin;
let isTrue;

        //Ready Function
$( function ()
{
    $( "#home" ).ready( function ()
    {
        localStorage.clear();
        isTrue = false
        homePage();
    });

    $( "#home" ).click( function ()
    {
        clearData();
        isTrue = false
        homePage();
    });

    $( "#report" ).click( function (event)
    {
        if(isTrue === true)
        {
            return;
        }
         reportPage();
    });
    
    $( "#about" ).click( function ()
    {
        clearData(); 
        isTrue = false
        aboutPage();
    });

    $( "#searchBtn" ).click( function ()
    {
        findCurrency();
    });  

});

function findCurrency()
{
    $( "#searchBtn" ).removeAttr("href")
    if($("#searchInput").val() === "")
    {
        alert("Please enter coin symbole");
        return;
    }
    relevaneData.forEach( findMySymbol => 
    {
        if($("#searchInput").val().toLowerCase() === findMySymbol.symbol)
        {
            $( "#searchBtn" ).attr("href", `#generalDiv_${ $("#searchInput").val().toLowerCase() }`)
            $( `#generalDiv_${ $( "#searchInput").val().toLowerCase() }` ).fadeOut().fadeIn()
            return ;
        }
    });

    if (  $( "#searchBtn" ).attr("href") === undefined )
    {
        alert ("Your coin was not found")
        $("#searchInput").focus()
      
    }
    $("#searchInput").val('')
    return;
}

 // Home Page function 
function homePage()
{
    $('#content').html('');
    $('#content').show();
    $("#chartContainer").hide()
    $("#aboutPage").hide()
    $("#searchArea").show()

    let  url = 'https://api.coingecko.com/api/v3/coins/list';
    const cb = function( xhr )
    {
        if( xhr.status === 200 )
        {
            showData( xhr );
        }
    }
    ajaxFetch( 'get' , url , cb )
}

   
function showData( xhr )
{
    var i = 0;
    let response = xhr.responseText;
    response.toLowerCase();
    let dataParse = JSON.parse( response ); 

        // FOR ALL COINS 
    //  relevaneData = dataParse       
        

        //choose only few coins
    const data = dataParse.filter( data => 
    {
        i ++;
        if ( i < 300 ) 
        {
            return data;
        }   	
    });
       relevaneData = data;
       //if you want to choose all the coins please mark this part with note and renote above part.



       relevaneData.forEach( buildDiv )   
}

//build My Divs function
function buildDiv( relevaneData )
{
    $('#content').append(`
    <div class="generalDiv" id="generalDiv_${relevaneData.symbol}">
        <div class='coinName'>
            <label id="toggleBtn" class="switch">
                <input id="checkboxStatus_${relevaneData.symbol}" type="checkbox" onclick="selectCoin(event, '${relevaneData.symbol}')">
                <span id="slider_${relevaneData.symbol}" class="slider round" ></span>
            </label>
            <div class="wrapDiv">
                    <h3 class="card-title">${relevaneData.name}</h5>
                    <h5 class="card-subtitle mb-2 text-muted">${relevaneData.symbol}</h6>
            </div>
            <button class="btnDiv" class="card-link" onclick="getDetails('${relevaneData.id}' , event)">More Info</button>
        </div>
            <div class='moreInfo'> </div>
    </div>
`
    );
}


    // Get more info for spesific coin
function getDetails( ID , event )
{
    if( localStorage.length > 0 )
    {
        for( var i= 0; i<localStorage.length; i++ )
        {
            findKey= localStorage.key( i )
            if( findKey === ID )
            {       
                findDataFromStorage(ID)
            }
        }
    }
        let url = `https://api.coingecko.com/api/v3/coins/${ID}?fields=img.small;usd;eur;ils`;
        let cb=function( xhr )
        {  
            moreInfoData( xhr , event )
        }
    ajaxFetch('get' , url , cb)
}
       
       
function findDataFromStorage( ID )
{
        //Find searching time
    let currencyStr= localStorage.getItem( findKey )
    let currencyJson = JSON.parse( currencyStr )
    let lastSearchTime = currencyJson.time;
        //Find Minutes
    let searchTimeMinutes = lastSearchTime.split( ":" )
    let minutesOfSearch = parseInt( searchTimeMinutes[1] )

            //Find current time
    let d = new Date()
    let currentTime = d.getHours() + ":" + d.getMinutes()
           //finf only minutes
    let currentTimeInMinutes = d.getMinutes()
            
            //check if 2 min left
    if( lastSearchTime <= currentTime )
    {
        let check = currentTimeInMinutes - minutesOfSearch
        if ( check <= 2 )
        {
            getInfoFromStorage( ID )
        }
    }
}

function getInfoFromStorage( ID )
{
    for ( let i =0; i < localStorage.length; i++ )
    {
        let findData = localStorage.key( ID )
        findData = localStorage.getItem(ID)
        let foundDataJson = JSON.parse(findData);
        showMoreInfo( foundDataJson , event )
        return;
    }
}

function moreInfoData( relevaneData ,event )
{
    const btn = event.target;
    const newDiv = $( btn ).closest( ".generalDiv" );
     moreInfo = newDiv.find( ".moreInfo" );
    newDiv.addClass( 'showCoinData' );

    let moreInfoResulte = relevaneData.responseText;
    moreInfoResulte = moreInfoResulte.replace(/'="https/g, "='https");
    moreInfoResulte = moreInfoResulte.replace(/'">/g, "'>");
    moreInfoResulte = moreInfoResulte.replace(/\n\r/g, "");
    let data = JSON.parse( moreInfoResulte );
    showMoreInfo( data ,moreInfo )

}


function showMoreInfo( relevaneData , moreInfo )
{
    $( moreInfo ).html(`
    <button class="backBtn card-link">Back </button>
        <div>${relevaneData.symbol}</div>
        <img src="${relevaneData.image.small}">
        <div> $ ${relevaneData.market_data.current_price.usd}</div>
        <div> € ${relevaneData.market_data.current_price.eur}</div>
        <div> ₪ ${relevaneData.market_data.current_price.ils}</div>

    `);

        $('.backBtn').click(function()
        {
        const btn = $( this );
        const newDiv = $( btn ).closest( ".generalDiv" );
        newDiv.removeClass('showCoinData');
        })
        saveToStorage( relevaneData )
}

        //Saving to localStorage with currentTime
function saveToStorage( relevaneData )
{
                //find time
    let d = new Date()
    let timeOfSearch= d.getHours() + ":" + d.getMinutes()
    relevaneData["time"] = timeOfSearch;

        //save in storage
    localStorage.setItem( `${relevaneData.id}` ,JSON.stringify( relevaneData ))
}

       
    //Create a Dialog
function createDialog( contentCb ) 
{
    const dialog = document.createElement('div');
    dialog.id = 'dialog'
    dialog.style.width = '600px';
    dialog.style.height = '550px';
    dialog.style.border = '2px black';
    dialog.style.backgroundColor = 'rgb(230, 218, 114)';
    dialog.style.top = '200px';
    dialog.style.left = '100px';
    dialog.innerHTML = "<span  class='closeBtn' title='Close' onclick='closeDialog(event)'>+</span>";
    dialog.innerHTML += contentCb();

    const bgDialog = document.createElement( 'div' );
    bgDialog.style.cssText = `
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: rgb(0,0,0,.4);
          position: absolute;
          position : fixed;
          display: flex;
          align-items: center ; 
          justify-content: center;
    `
    bgDialog.appendChild( dialog );
    return bgDialog;
}


        //Build Dialog Model
function modelToremoveCoin()
{
    let html;
    html= `
    <br><br>
    <h4>Please remove one coin in order to select ${lastCoin}</h4>
    `;
    selectedCoins.forEach( i => {
        html += `
        <br>
        <div class='modalSelectedCoins' indexID = ${i}>                
            <label  class="switch">
                    <input type="checkbox" checked  onclick="changeCoinSelection(event, '${i}')">
                    <span class='slider round'></span>
            </label>
            name: ${i} 
            
        </div>
        `;
    })
    html +=`
        <input onclick='okDialog(event)'  id="ok" type="button" value="OK">
        <input onclick= 'closeDialog(event)'  id="cancel" type="button" value="Cancel">
        `;
    return html;
}


function okDialog( e )
{
    if( coinsToRemove.length === 0 )
    {
        $(`#checkboxStatus_${lastCoin}`).prop('checked' , false);
    }
    if(coinsToRemove.length > 0)
    {
        coinsToRemove.forEach( symbol => 
        {
              //remove from selected coins array 
            var index = selectedCoins.indexOf( symbol );
            if ( index > -1 ) 
            {
                selectedCoins.splice( index, 1 );
            }  
                //and uncheck from html
            $(`#checkboxStatus_${symbol}`).prop('checked' , false);

        });

        selectedCoins.push( lastCoin )

    }
        
    coinsToRemove = [];
    e.target.parentElement.parentElement.remove()
    return; 
}
    
function closeDialog( e ) 
{
    $(`#checkboxStatus_${lastCoin}`).prop('checked' , false);
    coinsToRemove.forEach( sy =>
        {
            selectedCoins.push(sy)
        } )
        coinsToRemove = [];
    e.target.parentElement.parentElement.remove()
    return;
}


function changeCoinSelection( event, symbol )
{
    var isinclude = selectedCoins.includes( symbol );
    if ( isinclude === true )
    {
        var index = selectedCoins.indexOf( symbol );
        if ( index > -1 ) 
        {
            selectedCoins.splice( index, 1 );
            coinsToRemove.push( symbol );
        }   
    }
    else
    {
        selectedCoins.push( symbol );
    }
}

      //  Find Selected Coins
function selectCoin( event , coinSymbol )
{
    lastCoin  =  coinSymbol;
    addSymblToArray( lastCoin );
}

      
    //addSymblToArray Add / Remove selected Coins to arry
function addSymblToArray( symbol  )
{
    var isInclude = selectedCoins.includes( symbol );
    if ( isInclude === true )
    {
        let index = selectedCoins.indexOf( symbol );
        if ( index > -1 ) 
        {
            selectedCoins.splice( index, 1 );
        }   
    
    }
    else
    {
        chekDataAndWorningInCaseNoData(symbol)
    }
}

function chekDataAndWorningInCaseNoData(coinSymbol)
{
    url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${ coinSymbol.toUpperCase() }&tsyms=USD`
    
    $.get(url, function(response)
    {
        if(response.Message === `There is no data for any of the toSymbols ${coinSymbol.toUpperCase()} .` )
        {
            $(".notify").addClass("active");
            $("#notifyType").addClass("failure");
            $('.failure').html(`F.Y.I - there is no information for ${coinSymbol.toUpperCase()}`)
            
            setTimeout(function(){
                $(".notify").removeClass("active");
                $("#notifyType").removeClass("failure");
            },2000);

            $(`#checkboxStatus_${coinSymbol}`).prop('checked' , false);
            $(`#checkboxStatus_${coinSymbol}`).attr('disabled','disabled');
            $(`#slider_${coinSymbol}`).css('background-color', 'red')
            return;
        }

        else
        {
            if( selectedCoins.length < allowedCoins ){

                selectedCoins.push( coinSymbol );

            }
            else{
                const dialog = createDialog( modelToremoveCoin );
                document.body.appendChild( dialog );
            }  
        }
    })
}



window.onscroll = function() {scrollFunction()};

function scrollFunction() 
{
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() 
{
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}  

