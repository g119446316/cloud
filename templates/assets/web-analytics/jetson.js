$(function () {
   var socket = io.connect();
            socket.on('status_response', function(msg) {
                var date = new Date();
      document.getElementById("titlerealtime").innerHTML="Real Time : "+msg.time;
      document.getElementById("ape").innerHTML="APE : "+msg.APE;


CanvasJS.addColorSet("customColorSet",
                [//colorSet Array
               "#393f63",
		"#e5d8B0", 
		"#ffb367", 
		"#f98461", 
		"#d9695f",
		"#e05850"             
                ]);
    
   //CPU 1-4
    var dps = [{x:1,y:msg.GPU,label:"gpu"},{x: 2,y:msg.CPU1,label:"cpu1"},{x: 3,y: msg.CPU2,label:"cpu2"},{x: 4,y:msg.CPU3,label:"cpu3"},{x: 5,y:msg.CPU4,label:"cpu4"}];
    var usersStateBarChart = new CanvasJS.Chart("users-state-bar-chart",
    {
     colorSet: "customColorSet",
      
      axisX: {
        labelFontSize: 18,
	lineThickness: 0,
	tickThickness: 0
      },
      axisY: {
	gridThickness: 0,
	lineThickness: 0,
	tickThickness: 0,
        maximum:100,
        minimum:0,
	valueFormatString: " "
      },
      legend: {
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      data: [

      {       
      indexLabelFontColor: "#717171",
       indexLabelFontSize: 18,
       indexLabelPlacement: "outside",
       indexLabelFormatter: function (e) {
					return e.dataPoint.y + "%";  
				},
        type: "bar",          
        dataPoints:dps

      }
      ]
    });

    usersStateBarChart.render();
      var updateInterval = 2000;

      var updateChart = function () {
        dps.push({x: 1,y: msg.GPU, label:"gpu"});
      	dps.push({x: 2,y: msg.CPU1, label:"cpu1"});
      	dps.push({x: 3,y: msg.CPU2, label:"cpu2"});
        dps.push({x: 4,y: msg.CPU3, label:"cpu3"});
        dps.push({x: 5,y: msg.CPU4, label:"cpu4"});
	dps.shift();
        dps.shift();
      	dps.shift();
        dps.shift();
        dps.shift();

    usersStateBarChart.render();
  };

  //Fan 
	var fanspeed=Math.floor(msg.fan)
	var fandps=[{y:fanspeed,legendText:fanspeed+"%"},{y:100-fanspeed,legendText:100-fanspeed+"%" }]
	var fan = new CanvasJS.Chart("fanchart", {
		animationDuration: 900,
		animationEnabled: true,
		backgroundColor: "transparent",
		colorSet: "customColorSet",
		title: {
			dockInsidePlotArea: true,
			fontSize: 55,
			fontWeight: "normal",
			horizontalAlign: "center",
			verticalAlign: "center",
			text :Math.floor(msg.fan)+"%"
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal"
		},
		data: [
			{
			innerRadius: "90%",
			radius: "80%",
			legendMarkerType: "square",
			showInLegend: true,
			startAngle: 60,
			type: "doughnut",
			dataPoints: fandps
			}
		]
	});
    fan.render();
    var updateInterval = 2000;

    var updatefan = function () {
	y1 = Math.floor(msg.fan);
	y2 = 100-y1;
      	fandps.push({y: y1,legendText:y1+"%"});
        fandps.push({y: y2 ,legendText:y2+"%"});
	fandps.shift();
        fandps.shift();

	fan.render();
  }  ;


//pll temp

        var temp_pll=msg.Temp_PLL      
        var temppllchart = new CanvasJS.Chart("temp-pll-chart", {
                animationDuration: 900,
                animationEnabled: true,
                backgroundColor: "transparent",
                title: {
                        dockInsidePlotArea: true,
                        fontSize: 55,
                        fontWeight: "normal",
                        horizontalAlign: "center",
                        verticalAlign: "center",
                        text :temp_pll+"℃  "
                },
                toolTip: {
                        cornerRadius: 0,
                        fontStyle: "normal"
                },
                data: [
                        {
                        color:"orange",
                        innerRadius: "90%",
                        radius: "80%",
                        legendMarkerType: "square",
                        showInLegend: true,
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_pll,legendText:"temp_pll"}]
                        }
                ]
        });
        temppllchart.render();




//thermal temp

        var temp_thermal=msg.Temp_thermal      
        var tempthermalchart = new CanvasJS.Chart("temp-thermal-chart", {
                animationDuration: 900,
                animationEnabled: true,
                backgroundColor: "transparent",
                title: {
                        dockInsidePlotArea: true,
                        fontSize: 55,
                        fontWeight: "normal",
                        horizontalAlign: "center",
                        verticalAlign: "center",
                        text :temp_thermal+"℃  "
                },
                toolTip: {
                        cornerRadius: 0,
                        fontStyle: "normal"
                },
                data: [
                        {
                        color:"#e05850",
                        innerRadius: "90%",
                        radius: "80%",
                        legendMarkerType: "square",
                        showInLegend: true,
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_thermal,legendText:"temp_thermal"}]
                        }
                ]
        });
        tempthermalchart.render();







// thermal temp










setInterval(function(){updateChart()}, updateInterval); 
setInterval(function(){updatefan()}, updateInterval); 







 });



//socket222
socket.on('status_response', function(msg) {
var date = new Date();
document.getElementById("nvenc").innerHTML="NVENC : ["+msg.NVENC+"]";
document.getElementById("nvdec").innerHTML="NVDEC : ["+msg.NVDEC+"]";
document.getElementById("nvjpg").innerHTML="NVJPG : ["+msg.NVJPG+"]";
document.getElementById("nvp-model").innerHTML="NVP model : "+msg.nvp_model;

CanvasJS.addColorSet("customColorSet",
                [//colorSet Array
               "#393f63",
                "#e5d8B0", 
                "#ffb367", 
                "#f98461", 
                "#d9695f",
                "#e05850"             
                ]);

// temp cpu
 var temp_cpu=msg.Temp_CPU
        var tempcpuchart = new CanvasJS.Chart("temp-cpu-chart", {
                animationDuration: 900,
                animationEnabled: true,
                backgroundColor: "transparent",
                title: {
                        dockInsidePlotArea: true,
                        fontSize: 55,
                        fontWeight: "normal",
                        horizontalAlign: "center",
                        verticalAlign: "center",
                        text :temp_cpu+"℃  "
                },
                toolTip: {
                        cornerRadius: 0,
                        fontStyle: "normal"
                },
                data: [
                        {
                        color:"orange",
                        innerRadius: "90%",
                        radius: "80%",
                        legendMarkerType: "square",
                        showInLegend: true,
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_cpu,legendText:"temp_cpu"}]
                        }
                ]
        });
        tempcpuchart.render();


// temp gpu
 var temp_gpu=msg.Temp_GPU      
        var tempgpuchart = new CanvasJS.Chart("temp-gpu-chart", {
                animationDuration: 900,
                animationEnabled: true,
                backgroundColor: "transparent",
                title: {
                        dockInsidePlotArea: true,
                        fontSize: 55,
                        fontWeight: "normal",
                        horizontalAlign: "center",
                        verticalAlign: "center",
                        text :temp_gpu+"℃  "
                },
                toolTip: {
                        cornerRadius: 0,
                        fontStyle: "normal"
                },
                data: [
                        {
                        color:"orange",
                        innerRadius: "90%",
                        radius: "80%",
                        legendMarkerType: "square",
                        showInLegend: true,
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_gpu,legendText:"temp_gpu"}]
                        }
                ]
        });
        tempgpuchart.render();



// temp ao
 var temp_ao=msg.Temp_AO
        var tempaochart = new CanvasJS.Chart("temp-ao-chart", {
                animationDuration: 900,
                animationEnabled: true,
                backgroundColor: "transparent",
                title: {
                        dockInsidePlotArea: true,
                        fontSize: 55,
                        fontWeight: "normal",
                        horizontalAlign: "center",
                        verticalAlign: "center",
                        text :temp_ao+"℃  "
                },
                toolTip: {
                        cornerRadius: 0,
                        fontStyle: "normal"
                },
                data: [
                        {
                        color:"orange",
                        innerRadius: "90%",
                        radius: "80%",
                        legendMarkerType: "square",
                        showInLegend: true,
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_ao,legendText:"temp_ao"}]
                        }
                ]
        });
        tempaochart.render();

//emc



var emcchart = new CanvasJS.Chart("emc-chart",
	{
		theme: "light2",
		colorSet: "customColorSet",
		data: [
		{
			type: "pie",
			 startAngle:90,
			showInLegend: true,
			toolTipContent: "{y} - #percent %",
			dataPoints: [
				{  y: msg.EMC, indexLabel: "EMC-#percent %",legendText:"EMC"  },
				{  y: 4194304-msg.EMC, indexLabel: "FREE EMC-#percent %" , legendText:"FREE EMC" },

			]
		}
		]
	});
	emcchart.render();

var ramchart = new CanvasJS.Chart("ram-chart",
        {
                theme: "light2",
                colorSet: "customColorSet",
                data: [
                {       
                        type: "pie",
			startAngle:90,
                        showInLegend: true,
                        toolTipContent: "{y} - #percent %",
                        dataPoints: [
                                {  y: msg.RAM, indexLabel: "RAM-#percent %",legendText:"RAM" },
                                {  y: 4194304-msg.RAM, indexLabel: "FREE RAM-#percent %",legendText:"FREE RAM"  },

                        ]
                }
                ]
        });
        ramchart.render();





});
});


