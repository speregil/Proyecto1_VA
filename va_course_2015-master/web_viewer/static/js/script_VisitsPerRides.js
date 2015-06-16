/**
 *
 */
	

	var datasetTimePerRide;
	var switchFirstTime_timePerRide = true;
	var specificHeightDomainWhenUpdate_timePerRide;
	var densidadArray = new Array();
	
	pos_rides={ 
     "X":[63,0,99,73,76,17,6,38,73,27,43,87,79,32,34,83,86,16,79,60,48,43,85,87,17,92,45,69,78,87,82,47,67,16,23,42,28,78,81,26,50,76], 
     "Y":[99,67,77,84,88,43,43,90,79,15,78,81,89,33,68,88,44,49,87,37,87,56,86,63,67,81,24,44,48,48,80,11,37,66,54,37,66,37,77,59,57,22] 
	};
	
	ride_densidad={
		"X":0,
		"Y":0,
		"count":0	
	};
	
	timePerRide();
	d3.select("#questiontimePerRide .button_friday").on("click", timePerRideFriday);		
	d3.select("#questiontimePerRide .button_saturday").on("click", timePerRideSaturday);
	//d3.select("#questiontimePerRide .button_sunday").on("click", ridesPerRideSunday);
	
	function crearArray_timePerRide(array){
		datasetTimePerRide = array;
		console.log("Llego la informacion");	
		console.log(datasetTimePerRide);
		
		if(switchFirstTime_timePerRide==true){
			
			createFirstTimeGraph_timePerRide();
		}
		else{
			updateGraphstoDay_timePerRide();
		}
	}
	function timePerRide() {        				
		//updateGraphstoDay_timePerRide();
		var posX = pos_rides.X;
		var posY = pos_rides.Y;
		for(var i = 0; i < posX.length; i++){
			temp = ride_densidad;
			
			//console.log(ride_densidad.X +","+ ride_densidad.Y);
			var url="conteo?"+
				"dia="+"Sabado"+"&"+
				"x="+posX[i]+"&"+
				"y="+posY[i]+"&"+
				"hora="+"PM"+"&"+
				"tipo="+"Dia";
			d3.json(url, function (e, d) {
				//console.log(d.array);
				var data = d.array;
				temp.X = posX[i];
				temp.Y = posY[i];
				ride_densidad.count = data[0].count;
				densidadArray.push(ride_densidad);
				//console.log(densidadArray[i]);	
			})
        }
		console.log(densidadArray);
		crearArray_timePerRide(densidadArray);
		
	
    }
	
	
    function timePerRideFriday() {  
	$("#questiontimePerRide #diaEscogido").html("Loading....");       				
		//updateGraphstoDay_timePerRide();
		switchFirstTime_timePerRide = false;
        console.log("reading guest");        
		var url="duracion?"+
            "dia="+"Viernes";
        d3.json(url, function (e, d) {
            crearArray_timePerRide(d.array);
			console.log(d.array);
			$("#questiontimePerRide #diaEscogido").html("Friday");  
        });	
    }
	function timePerRideSaturday() {
		$("#questiontimePerRide #diaEscogido").html("Loading...");       				
		//updateGraphstoDay_timePerRide();
		switchFirstTime_timePerRide = false;
        console.log("reading guest");        
		var url="duracion?"+
            "dia="+"Sabado";
        d3.json(url, function (e, d) {
            crearArray_timePerRide(d.array);
			console.log(d.array);
			$("#questiontimePerRide #diaEscogido").html("Saturday");  
        });	
    }
	
function createFirstTimeGraph_timePerRide(){
	 //Width and height
	var w = 600;
	var h = 250;	
	specificHeightDomainWhenUpdate_timePerRide = d3.max(datasetTimePerRide, function(d) { return d.duration; });
	console.log("la altura del dominio es "+specificHeightDomainWhenUpdate_timePerRide);	
		var xScale = d3.scale.ordinal()
						.domain(d3.range(datasetTimePerRide.length))
						.rangeRoundBands([0, w], 0.05);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(datasetTimePerRide, function(d) { return d.duration; })])
						.range([0, h]);
						
		//Define X axis
		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .tickFormat(function(d) { 
									var textoAxis="between " + datasetTimePerRide[d].min + " and " + datasetTimePerRide[d].max +" hours";
									return textoAxis;
									})
						  .orient("bottom");
		
		//Create SVG element 
		var svg = d3.select("#questiontimePerRide .ourGraph")
					.append("svg")
					.attr("width", w)
					.attr("height", h+40);
		var g = svg.append("g")
			.attr("transform", "translate(0,20)");
		//Create bars
		g.selectAll("rect")
		   .data(datasetTimePerRide)
		   .enter()
		   .append("rect")
		   .attr("x", function(d, i) {
				return xScale(i);
		   })
		   .attr("y", function(d) {
				return h - yScale(d.duration);
				
		   })
		   .attr("width", xScale.rangeBand())
		   .attr("height", function(d) {
				return yScale(d.duration);
		   })
		   .attr("fill", function(d) {
				return "rgb(0, 0, " + parseInt(yScale(d.duration)) + ")";
		   });

		//Create labels
		var sum = d3.sum(datasetTimePerRide, function(d) { return d.duration; });
		console.log(sum);
		
		g.selectAll("text")
		   .data(datasetTimePerRide)
		   .enter()
		   .append("text")
		   .text(function(d) {
			   var texto=d.duration + " ("+	Math.round(((d.duration*100)/sum)*100)/100 + "%)";
				return texto;
		   })
		   .attr("text-anchor", "middle")
		   .attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 2;
		   })
		   .attr("y", function(d) {
				return h - yScale(d.duration) - 5;
		   })
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "11px")
		   .attr("fill", "black");
		   
		   //Create X axis
		g.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + h  + ")")
			.call(xAxis);

	
}
			
		
				
function updateGraphstoDay_timePerRide(){
	
	var w = 600;
	var h = 250;			
	var xScale = d3.scale.ordinal()
					.domain(d3.range(datasetTimePerRide.length))
					.rangeRoundBands([0, w], 0.05);
	
	var yScale = d3.scale.linear()
					.domain([0, specificHeightDomainWhenUpdate_timePerRide])
					.range([0, h]);
					
	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .tickFormat(function(d) { 
								var textoAxis="between " + datasetTimePerRide[d].min + " and " + datasetTimePerRide[d].max;
								return textoAxis;
								})
					  .orient("bottom");
					  
				  
	//Update all rects
	var svg = d3.select("#questiontimePerRide .ourGraph")
		svg.selectAll("#questiontimePerRide rect")
		   .data(datasetTimePerRide)
		   .transition()
		   .delay(function(d, i) {
			   return i / datasetTimePerRide.length * 1000;
		   })
		   .duration(500)
		   .attr("y", function(d) {
				return h - yScale(d.duration);
		   })
		   .attr("height", function(d) {
				return yScale(d.duration);
		   })
		   .attr("fill", function(d) {
				return "rgb(0, 0, " + parseInt(yScale(d.duration)) + ")";
		   });

	//Update all labels
	var sum = d3.sum(datasetTimePerRide, function(d) { return d.duration; });
	svg.selectAll("#questiontimePerRide text")
	   .data(datasetTimePerRide)
	   .transition()
	   .delay(function(d, i) {
		   return i / datasetTimePerRide.length * 1000;
	   })
	   .duration(500)
	   .text(function(d) {
			var texto=d.duration + " ("+Math.round(((d.duration*100)/sum)*100)/100 + "%)";
			return texto;
	   })
	   .attr("x", function(d, i) {
			return xScale(i) + xScale.rangeBand() / 2;
	   })
	   .attr("y", function(d) {
			return h - yScale(d.duration) - 5;
	   });

}