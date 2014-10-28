function barChart() {
    var g, bins = 4, width, height, funcs=[];

    var margin = {top: 10, right: 10, bottom: 20, left: 100},
        x = d3.scale.ordinal().domain(d3.range(bins)),
        y = d3.scale.linear().domain([0, 1]),
        xaxis = d3.svg.axis().scale(x).orient("bottom"),
        yaxis = d3.svg.axis().scale(y).orient("left");

    var data = Array.apply(null, new Array(bins)).map(Number.prototype.valueOf,0);

    function update()
    {
        if(!g) return;
        hists = g.selectAll("g").data(funcs);
        hists.enter().append("g"); 
        hists.exit().remove();

        lines = hists.selectAll("line").data(function(d){
            return data.map(function(x,i){return d.func(i);});
        });
        lines.enter().append("line"); 
        lines.exit().remove();

        lines.attr("class", "bar");

        var barwidth = x.rangeBand();
        lines.attr("x1", function(d,i){return x(i)+barwidth/2;})
             .attr("y1", function(d,i){return y(0);})
             .attr("x2", function(d,i){return x(i)+barwidth/2;})
             .attr("y2", function(d,i){return y(d);});
    };


    function chart(svg) 
    {
        width  = svg[0][0].offsetWidth  - margin.left - margin.right;
        height = svg[0][0].offsetHeight - margin.top  - margin.bottom;

        x.rangeRoundBands([0,  width]);
        y.rangeRound([height,0]);

        // Create the skeletal chart.
        if(svg.select("g").empty()) 
        {
            g = svg.append("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xaxis);

            g.append("g")
                .attr("class", "y axis")
                .call(yaxis);

            g = g.append("g");
        }
        update();
   }

    chart.margin = function(_) { if (!arguments.length) return margin;  margin = _; return chart; };
    chart.funcs  = function(_) { 
        if (!arguments.length) return funcs;    funcs = _; update(); return chart; 
    }
    chart.bins   = function(_) { 
        if (!arguments.length) return bins; 
        bins = _; 
        data = Array.apply(null, new Array(bins)).map(Number.prototype.valueOf,0);
        x.domain(d3.range(bins));
        return chart; 
    };
    chart.ylims = function(_){
        if (!arguments.length) return y.domain();    
        y.domain(_); update();
        return chart; 
    };
    chart.ytransition = function(_){
        if (!arguments.length) return y.domain();    
        y.domain(_); 
        
        d3.transition().duration(750)
         .select(".y.axis")
         .call(yaxis);

        update();
        return chart; 
    };
    return chart;
}
