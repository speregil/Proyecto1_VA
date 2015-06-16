/**
 *
 */
 
    var date_format = d3.time.format("%Y-%m-%d %H:%M:%S");
    var scale_x = d3.scale.linear();
    scale_x.domain([0, 100]);
    scale_x.range([0, 800]);

    var scale_y = d3.scale.linear();
    scale_y.domain([0, 100]);
    scale_y.range([800, 0]);

    var colors = colorbrewer.PuBuGn[9];
    var time_scale = d3.time.scale();
    var time_scale_aux = d3.time.scale();
    var open_time = date_format.parse("2014-6-06 08:00:00");
    var close_time = date_format.parse("2014-6-06 20:30:00");
    time_scale_aux.domain([open_time, close_time]);
    time_scale_aux.range([0,colors.length-1]);
    var time_domain=d3.range(colors.length).map(function(i){return time_scale_aux.invert(i);});
    time_scale.domain(time_domain);
    time_scale.range(colors);

    var svg = d3.select("#main_svg");
    var scatter = svg.append("g");
	
	/**
	Variables "auxiliares"
	**/
	
	densidad_viernes={ 
     "X":[63,0,99,73,76,17,6,38,73,27,43,87,79,32,34,83,86,16,79,60,48,43,85,87,17,92,45,69,78,87,82,47,67,16,23,42,28,78,81,26,50,76], 
     "Y":[99,67,77,84,88,43,43,90,79,15,78,81,89,33,68,88,44,49,87,37,87,56,86,63,67,81,24,44,48,48,80,11,37,66,54,37,66,37,77,59,57,22], 
     "densidad":[2182,912,1074,4045,1787,10779,2346,8377,3736,8694,10074,2571,2270,9291,9940,1690,9957,2301,2793,2539,3842,2417,1857,4798,6909,1587,12456,11260,10371,5687,2442,8866,2693,9187,14027,2812,8412,3772,3279,2627,461,2634]
	};
	
	densidad_sabado={
	 "X":[99,63,0,83,16,60,47,17,78,69,79,28,78,73,73,87,32,16,42,48,79,92,85,38,67,87,43,34,45,76,81,87,27,6,17,82,23,86,43,26,50,76],	
	 "Y":[77,99,67,88,66,37,11,43,48,44,87,66,37,84,79,63,33,49,37,87,89,81,86,90,37,81,56,68,24,88,77,48,15,43,67,80,54,44,78,59,57,22],
     "densidad":[3280,7590,2523,2854,13884,4558,12419,16048,14961,16262,4277,14359,5490,6935,6549,7913,14035,3465,4469,5553,3811,2359,3027,12015,4992,4879,3636,16547,18993,2732,5397,8979,12982,3645,11602,3887,22526,14108,16464,3736,231,4487]	 
	};
	
	densidad_domingo={
	 "X":[0,99,63,17,82,79,87,81,23,16,48,32,87,60,76,47,43,73,79,28,86,34,45,38,27,26,69,16,87,17,78,43,50,83,85,73,78,67,42,92,6,76,82,26,78,47],	
	 "Y":[67,77,99,67,80,89,81,77,54,66,87,33,63,37,88,11,56,79,87,66,44,68,24,90,15,59,44,49,48,43,48,78,57,88,86,84,37,37,37,81,43,22,80,59,37,11],
     "densidad":[3577,4226,7441,14118,4628,4041,5856,6745,26347,16056,7292,11841,9118,5502,3488,15361,4556,8102,5455,17314,18066,20234,23625,16224,15361,4600,18701,4125,10416,18309,16992,20674,306,3222,3221,7584,6366,5726,5975,3226,4453,4197,72,78,10,6]	 
	};

	function draw_checkins(array){
		console.log("Llego la información");
		console.log(densidad_domingo.densidad[32])
			
    // parse times
        array.forEach(function (e, i, a) {
            e.time = date_format.parse(e.Timestamp);
        });


        function draw_ckeckinPoints(above_lim) {
          //con enter() solo lee los datos nuevos y los viejos los deja igual. Si uso el attr() ahí si actualiza los existentes y exit().remove() cuando son menos datos y quiero que borre los restantes
            scatter.selectAll(".checkin").data(array).enter().append("circle").attr("class", "checkin")
                    .attr("r", 6)
                    .attr("cx", function (d) {
                        return scale_x(d.X);
                    })
                    .attr("cy", function (d) {
                        return scale_y(d.Y);
                    })
                    /*.attr("fill", function (d) {
                        return time_scale(d.time);
                    })*/
					.attr("fill", "yellow")
                    //.classed("checkin",function(d){return d.type == "check-in";})
                    .append("title").text(function(d){return d.Timestamp});
        }
		draw_ckeckinPoints(array);
        d3.select("#show_guest_button").attr("disabled", null);

    
	}
	
	function test(array){
		console.log("Llego la informacion");
		console.log(array[0]);
	}

    function read_guest() {
        scatter.selectAll(".checkin").remove();
        console.log("reading guest");
        d3.select("#show_guest_button").attr("disabled", true);
		var url="visitas?"+
            "dia="+"Sabado"+"&"+
            "hora="+"PM"+"&"+
            "tipo="+"Dia";
        d3.json("promedio", function (e, d) {
            test(d.array);
        });
    }

    //d3.select("#show_guest_button").on("click", read_guest);
	
	 d3.select("#questionStay .dayButtons .button_friday").on("click", read_guest);