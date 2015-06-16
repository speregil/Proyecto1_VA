/**
 *
 */
	

	var dataset;
	var switchFirstTime = true;
	var specificHeightDomainWhenUpdate;
	ridesPerPersonFirstLoad();
	d3.select("#questionVisits .button_friday").on("click", ridesPerPersonFriday);		
	d3.select("#questionVisits .button_saturday").on("click", ridesPerPersonSaturday);
	//d3.select("#questionVisits .button_sunday").on("click", ridesPerPersonSunday);
	
	function crearArray_visitPerDay(array){
		dataset = array;
		console.log("Llego la informacion");	
		if(switchFirstTime==true){
			console.log("es verdad");
			createFirstTimeGraph();
		}
		else{
			updateGraphstoDay();
		}
	}
	function ridesPerPersonFirstLoad() {        				
		//updateGraphstoDay();			
        console.log("reading guest");        
		var url="visitas?"+
            "dia="+"Sabado"+"&"+
            "hora="+"PM"+"&"+
            "tipo="+"Dia";
        d3.json(url, function (e, d) {
            crearArray_visitPerDay(d.array);
			console.log(d.array);
        });
	
    }
    function ridesPerPersonFriday() {        				
		//updateGraphstoDay();
		switchFirstTime = false;
        console.log("reading guest");        
		var url="visitas?"+
            "dia="+"Viernes"+"&"+
            "hora="+"PM"+"&"+
            "tipo="+"Dia";
        d3.json(url, function (e, d) {
            crearArray_visitPerDay(d.array);
			console.log(d.array);
        });	
    }
	function ridesPerPersonSaturday() {        				
		//updateGraphstoDay();
		switchFirstTime = false;
        console.log("reading guest");        
		var url="visitas?"+
            "dia="+"Sabado"+"&"+
            "hora="+"PM"+"&"+
            "tipo="+"Dia";
        d3.json(url, function (e, d) {
            crearArray_visitPerDay(d.array);
			console.log(d.array);
        });	
    }
	
function createFirstTimeGraph(){
	 //Width and height
	var w = 600;
	var h = 250;	
	specificHeightDomainWhenUpdate = d3.max(dataset, function(d) { return d.count; });
	console.log("la altura del dominio es "+specificHeightDomainWhenUpdate);	
		var xScale = d3.scale.ordinal()
						.domain(d3.range(dataset.length))
						.rangeRoundBands([0, w], 0.05);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(dataset, function(d) { return d.count; })])
						.range([0, h]);
						
		//Define X axis
		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .tickFormat(function(d) { 
									var textoAxis="between " + dataset[d].X + " and " + dataset[d].Y;
									return textoAxis;
									})
						  .orient("bottom");
		
		//Create SVG element 
		var svg = d3.select("#questionVisits .ourGraph")
					.append("svg")
					.attr("width", w)
					.attr("height", h+40);
		var g = svg.append("g")
			.attr("transform", "translate(0,20)");
		//Create bars
		g.selectAll("rect")
		   .data(dataset)
		   .enter()
		   .append("rect")
		   .attr("x", function(d, i) {
				return xScale(i);
		   })
		   .attr("y", function(d) {
				return h - yScale(d.count);
				
		   })
		   .attr("width", xScale.rangeBand())
		   .attr("height", function(d) {
				return yScale(d.count);
		   })
		   .attr("fill", function(d) {
				return "rgb(0, 0, " + parseInt(yScale(d.count)) + ")";
		   });

		//Create labels
		var sum = d3.sum(dataset, function(d) { return d.count; });
		console.log(sum);
		
		g.selectAll("text")
		   .data(dataset)
		   .enter()
		   .append("text")
		   .text(function(d) {
			   var texto=d.count + " ("+	Math.round(((d.count*100)/sum)*100)/100 + "%)";
				return texto;
		   })
		   .attr("text-anchor", "middle")
		   .attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 2;
		   })
		   .attr("y", function(d) {
				return h - yScale(d.count) - 5;
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
			
		
				
function updateGraphstoDay(){
	
	var w = 600;
	var h = 250;			
	var xScale = d3.scale.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([0, w], 0.05);
	
	var yScale = d3.scale.linear()
					.domain([0, specificHeightDomainWhenUpdate])
					.range([0, h]);
					
	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .tickFormat(function(d) { 
								var textoAxis="between " + dataset[d].X + " and " + dataset[d].Y;
								return textoAxis;
								})
					  .orient("bottom");
					  
				  
	//Update all rects
	var svg = d3.select("#questionVisits .ourGraph")
		svg.selectAll("#questionVisits rect")
		   .data(dataset)
		   .transition()
		   .delay(function(d, i) {
			   return i / dataset.length * 1000;
		   })
		   .duration(500)
		   .attr("y", function(d) {
				return h - yScale(d.count);
		   })
		   .attr("height", function(d) {
				return yScale(d.count);
		   })
		   .attr("fill", function(d) {
				return "rgb(0, 0, " + parseInt(yScale(d.count)) + ")";
		   });

	//Update all labels
	var sum = d3.sum(dataset, function(d) { return d.count; });
	svg.selectAll("#questionVisits text")
	   .data(dataset)
	   .transition()
	   .delay(function(d, i) {
		   return i / dataset.length * 1000;
	   })
	   .duration(500)
	   .text(function(d) {
			var texto=d.count + " ("+Math.round(((d.count*100)/sum)*100)/100 + "%)";
			return texto;
	   })
	   .attr("x", function(d, i) {
			return xScale(i) + xScale.rangeBand() / 2;
	   })
	   .attr("y", function(d) {
			return h - yScale(d.count) - 5;
	   });

}