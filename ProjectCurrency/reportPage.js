let dataPoints1 = [];
let dataPoints2 = [];
let dataPoints3 = [];
let dataPoints4 = [];
let dataPoints5 = [];
let timeArry = []
let interval;
var chartAA; 


function creatCanvas(){
    chartAA = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
            title:{
                text: "Coins"
            },
            axisY :{
                includeZero: false,
                title: "Price",
            },
            toolTip: {
                shared: "true"
            },
            legend:{
                cursor:"pointer",
               itemclick : toggleDataSeries
            },
            data:[ {
                type: "line",
                visible: true,
                showInLegend: true,
                 name: selectedCoins[0] , 
                 dataPoints: dataPoints1
                }, 
             {
                type: "line",
                visible: true,
                showInLegend: true,
                 name: selectedCoins[1],
                 dataPoints: dataPoints2
                },
             {
                type: "line",
                visible: true,
                showInLegend: true,
                 name: selectedCoins[2],
                 dataPoints: dataPoints3
             },
             {
                type: "line",
                visible: true,
                showInLegend: true,
                 name: selectedCoins[3],
                 dataPoints: dataPoints4
             },
             {
                type: "line",
                visible: true,
                showInLegend: true,
                 name: selectedCoins[4],
                 dataPoints: dataPoints5
             }]
    });
}




function reportPage(){


	if(selectedCoins.length < 1 )
	{
		return;
    }

    isTrue = true;
    creatCanvas();
    $("#searchArea").hide()
	$("#content").hide()
	$("#aboutPage").hide()
    $("#chartContainer").show() 
    updateChart();
    interval =  setInterval(function(){updateChart()}, 2000);
}

function updateChart(){ 


    xVal = getTime();
    //make function to create url
    url = getUrlFromSelectedCoins()
    
    $.get(url, function(response)
    {
   
         //push price to arry
         currentPriceArry = checkPriceAndPush(response)

        if(selectedCoins.length >= 1 )
        {
            if(currentPriceArry[0] !=0)
            {
                dataPoints1.push({   
                  x: xVal[0],
                  y: currentPriceArry[0]
                  });
            }
        }   

        if( selectedCoins.length > 1 && currentPriceArry[1] !=0 )
        {
           
                dataPoints2.push({   
                    x: xVal[0],
                    y: currentPriceArry[1]
                });
            
        
        }
        else
        {
            dataPoints2 = "";
        }

        
        if( selectedCoins.length > 2 && currentPriceArry[2] !=0 )
        {

                dataPoints3.push({   
                    x: xVal[0],
                    y: currentPriceArry[2]
                });

           
        }
        else
        {
            dataPoints3 = "";
        }

        if( selectedCoins.length > 3 && currentPriceArry[3] !=0 )
        {
            

                dataPoints4.push({   
                    x: xVal[0],
                    y: currentPriceArry[3]
                });
            
        }
        else
        {
            dataPoints4 = "";
        }
        if( selectedCoins.length > 4 && currentPriceArry[4] !=0 )
        {
            dataPoints5.push({   
                x: xVal[0],
                y: currentPriceArry[4]
            });
        }
        else
        {
            dataPoints5 = "";
        }
        

            chartAA.render();
            return;


            
        });

}

function checkPriceAndPush(response)
{
    let currentPriceArry =[];

    selectedCoins.forEach(sy => {
        let mySy = sy.toUpperCase()
                //If choose undifuned coin

        if( response[mySy] === undefined)
        {
            currentPriceArry.push(0);
            return;
        }
        else
        {
        currentPrice= response[mySy].USD
        currentPriceArry.push(currentPrice);
        }

    });
    return currentPriceArry;
}


 function getTime()
 {
     timeArry = [ ];
    currentTime = new Date()
    currentTime.getTime();
    timeArry.push(currentTime)
    return timeArry;    
 }


function getUrlFromSelectedCoins()
{
    url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=` 
	
	lastItem = selectedCoins.splice(-1)[0]
	selectedCoins.forEach( i => 
		{
			url += `${i.toUpperCase()}` + ','
        })
        
		selectedCoins.push(lastItem)
        url += `${ lastItem.toUpperCase() }&tsyms=USD`

        return url;
}


function clearData(){

    // chartAA = "";
    dataPoints1 = [];
    dataPoints2 = [];
    dataPoints3 = [];
    dataPoints4 = [];
    dataPoints5 = [];
    selectedCoins = []
    currentPriceArry=[]
    clearInterval(interval) ; 
    return;

}

function toggleDataSeries(e) {
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
}

