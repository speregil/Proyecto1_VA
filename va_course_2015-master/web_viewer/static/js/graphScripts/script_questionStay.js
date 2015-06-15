
			//Width and height
			var w = 600;
			var h = 250;
			
			var dataset = [ 5, 10, 13, 19, 21, 25 ];
			
			var xScale = d3.scale.ordinal()
							.domain(d3.range(dataset.length))
							.rangeRoundBands([0, w], 0.05);

			var yScale = d3.scale.linear()
							.domain([0, d3.max(dataset)])
							.range([0, h]);
			
			//Create SVG element 
			var svg = d3.select("#questionStay .ourGraph")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Create bars
			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return xScale(i);
			   })
			   .attr("y", function(d) {
			   		return h - yScale(d);
			   })
			   .attr("width", xScale.rangeBand())
			   .attr("height", function(d) {
			   		return yScale(d);
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
			   });

			//Create labels
			svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		return xScale(i) + xScale.rangeBand() / 2;
			   })
			   .attr("y", function(d) {
			   		return h - yScale(d) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "white");




			//Friday On click, update with new data 			
			d3.select("#questionStay .button_friday")
				.on("click", function() {					
					dataset = [ 5, 10, 13, 19, 21, 25 ];					
					updateGraphstoDay();
					   				
				});
			
			//Saturday On click, update with new data 			
			d3.select("#questionStay .button_saturday")
				.on("click", function() {					
					dataset = [ 2, 4, 25, 15, 15, 20 ];						
					updateGraphstoDay();
					   				
				});
				
			d3.select("#questionStay .button_sunday")
				.on("click", function() {					
					dataset = [ 20, 2, 17, 9, 5, 4 ];						
					updateGraphstoDay();
					   				
				});
				
			function updateGraphstoDay(){
				//Update all rects
					svg.selectAll("#questionStay rect")
					   .data(dataset)
					   .transition()
					   .delay(function(d, i) {
						   return i / dataset.length * 1000;
					   })
					   .duration(500)
					   .attr("y", function(d) {
					   		return h - yScale(d);
					   })
					   .attr("height", function(d) {
					   		return yScale(d);
					   })
					   .attr("fill", function(d) {
							return "rgb(0, 0, " + (d * 10) + ")";
					   });

					//Update all labels
					svg.selectAll("#questionStay text")
					   .data(dataset)
					   .transition()
					   .delay(function(d, i) {
						   return i / dataset.length * 1000;
					   })
					   .duration(500)
					   .text(function(d) {
					   		return d;
					   })
					   .attr("x", function(d, i) {
					   		return xScale(i) + xScale.rangeBand() / 2;
					   })
					   .attr("y", function(d) {
					   		return h - yScale(d) + 14;
					   });
				
			}