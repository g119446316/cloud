var socket = io.connect();
var loadavgcount = 1;


$(function () {

  //get device ip
  $.get('/deviceip', function(data) {
       console.log("why");
	var select = document.getElementById("deviceip_select");
	var optval = $("#deviceip_select>option").map(function() { return $(this).val(); }).get();			
	if (optval.length <  data.device_ip.length){
		$("#deviceip_select").empty();
		var opt = document.createElement('option');
		opt.innerHTML = "IP Address";
		select.appendChild(opt);
               	for (i=0;i < data.device_ip.length;i++){
			opt = document.createElement('option');
			opt.value = data.device_ip[i];
			opt.innerHTML = data.device_ip[i];
			select.appendChild(opt);
			}
		}
});



  // document.body.style.backgroundColor = "gray";   




//init loadavg
var loadavg = new CanvasJS.Chart("loadavg-chart",{      
       axisX:{       
        interval: 1,
         //minimum:0
     },
        axisY:{       
        interval: 1,
         maximum:4
     },
      	data: [{
      		type: "spline",
      		dataPoints : [{y:0.1}]
      	}]
      });

      loadavg.render();

});


function get_value() {
var socket = io.connect();
socket.removeAllListeners();

var ip_adr = document.getElementById("deviceip_select").value;

console.log(ip_adr);

var loadavg = new CanvasJS.Chart("loadavg-chart",{      
       axisX:{       
        interval: 1,
         //minimum:0
     },
        axisY:{       
        interval: 1,
         maximum:4
     },
      	data: [{
      		type: "spline",
      		dataPoints : [{x:1,y:0.1}]
      	}]
      });

loadavg.render();




socket.on(ip_adr, function(msg) {

	console.log(ip_adr);
	//document.body.style.backgroundColor = "white";

	var date = new Date();

      //document.getElementById("titlerealtime").innerHTML="Real Time : "+msg.time;
      //document.getElementById("ape").innerHTML="APE : "+msg.APE;


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
    var dps = [{x:5,y:msg.GPU,label:"GPU"},{x: 4,y:msg.CPU1,label:"CPU1"},{x: 3,y: msg.CPU2,label:"CPU2"},{x: 2,y:msg.CPU3,label:"CPU3"},{x: 1,y:msg.CPU4,label:"CPU4"}];
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


  //Fan 
	var fanspeed=msg.fan;
	var fan = new CanvasJS.Chart("fanchart", {
		animationDuration: 900,
		animationEnabled: true,
		backgroundColor: "transparent",
		colorSet: "customColorSet",
		title: {
			dockInsidePlotArea: true,
			fontSize: 50,
			fontWeight: "normal",
			horizontalAlign: "center",
			verticalAlign: "center",
			text : fanspeed+"RPM"
		},
		toolTip: {
			cornerRadius: 0,
			fontStyle: "normal"
		},
		data: [
			{
			innerRadius: "90%",
			radius: "80%",
			//legendMarkerType: "square",
			//showInLegend: true,
			startAngle: 60,
			type: "doughnut",
			dataPoints: [{y:fanspeed}]
			}
		]
	});
    fan.render();


//pll temp

        var temp_pll=msg.PLL_therm;
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
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_pll}]
                        }
                ]
        });
        temppllchart.render();




//thermal temp

        var temp_thermal=msg.thermal_fan_est      
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
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_thermal}]
                        }
                ]
        });
        tempthermalchart.render();





// temp cpu
 var temp_cpu=msg.CPU_therm
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
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_cpu,legendText:"temp_cpu"}]
                        }
                ]
        });
        tempcpuchart.render();


// temp gpu
 var temp_gpu=msg.GPU_therm 
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
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_gpu,legendText:"temp_gpu"}]
                        }
                ]
        });
        tempgpuchart.render();



// temp ao
 var temp_ao=msg.AO_therm
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
                        startAngle: 60,
                        type: "doughnut",
                        dataPoints: [{y:temp_ao,legendText:"temp_ao"}]
                        }
                ]
        });
        tempaochart.render();

//system loadavg
var updateloadavgChart = function (count) {
        loadavgcount++;
	 
	loadavg.data[0].dataPoints.push({x:loadavgcount,y:msg.loadavg });
	loadavg.render();
        if(loadavg.data[0].dataPoints.length> 20){
		
		loadavg.data[0].dataPoints.shift();
	}
	loadavg.render();
	};

updateloadavgChart();

//mem
var memchart = new CanvasJS.Chart("mem-chart",
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
                                {  y: msg.mem, indexLabel: "Used  #percent %",legendText:"Used", indexLabelFontSize: 20  },
                                {  y: 100-msg.mem, indexLabel: "Free  #percent %",legendText:"Free" , indexLabelFontSize: 20  },

                        ]
                }
                ]
        });
        memchart.render();


/*document.getElementById("nvenc").innerHTML="NVENC : ["+msg.NVENC+"]";
document.getElementById("nvdec").innerHTML="NVDEC : ["+msg.NVDEC+"]";
document.getElementById("nvjpg").innerHTML="NVJPG : ["+msg.NVJPG+"]";
document.getElementById("nvp-model").innerHTML="NVP model : "+msg.nvp_model;*/


});

}

