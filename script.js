var rad_id;
var bar_id;

d3.csv('data.csv', function (error, data) {
    if (error) throw error;

    var vData = d3.stratify()
        .parentId(function (d) {
            return d.Category
        })
        .id(function (d) {
            return d.Desc;
        })
        (data);

    drawArea(data, vData)

});


function drawArea(data, vData) {
    var vWidth = document.getElementById('viz-1').offsetWidth;
    var vHeight = document.getElementById('viz-1').offsetHeight;
    var div = d3.select("#viz-1")
    var g = div.append('svg').attr('width', vWidth).attr('height', vHeight).append('g')
    // Declare d3 layout
    var vLayout = d3.treemap().size([vWidth, vHeight]).paddingOuter(1);

    // Color Scales
    var colorScale = d3.scaleOrdinal()
        .domain(["Fed ", "Heal", "Soci", "Nati", "Inco", "Net ", "Vete", "Tran", "Educ", "Inte", "Natu", "Immi", "Scie", "Resp", "Othe"])
        .range(d3.schemeCategory20)

    // Layout + Data
    var vRoot = d3.hierarchy(vData).sum(function (d) {
        return d.data.Value;
    });
    var vNodes = vRoot.descendants();
    vLayout(vRoot);
    var vSlices = g.selectAll('rect').data(vNodes).enter();

    // Draw on screen
    vSlices.append('rect')
        .attr('x', function (d) {
            return d.x0;
        })
        .attr('y', function (d) {
            return d.y0;
        })
        .attr('width', function (d) {
            return d.x1 - d.x0;
        })
        .attr('height', function (d) {
            return d.y1 - d.y0;

        }).attr('class', function (d) {
            return ("box-" + d.depth);
        }).attr('fill', function (d) {
            if (d.parent) {
                return colorScale(d.parent.data.id.substring(0, 4))
            }
        }).attr('stroke', function (d) {
            if (d.parent) {
                return '#333'
            } else {
                return '#777'
            }
        }).attr('stroke-width', 1)
        .on('mouseover', function (d) {

            if (d.parent) {
                document.getElementById("label").innerHTML = d.parent.data.id
                drawRad(d.parent.data.id, colorScale(d.parent.data.id.substring(0, 4)))
                drawBar(d.parent.data.id, colorScale(d.parent.data.id.substring(0, 4)))
            }
        }).on('mouseout', function (d) {
            if (d.parent) {
                drawRad(d.parent.data.id, colorScale(d.parent.data.id.substring(0, 4)))
                drawBar(d.parent.data.id, colorScale(d.parent.data.id.substring(0, 4)))
            }
        });

    var tSlices = g.selectAll('text').data(vNodes).enter();

    tSlices.append("text")
        .attr('x', function (d) {
            return d.x0 + 10;
        })
        .attr('y', function (d) {
            return d.y0 + 10
        }).attr('dy', '0.35em')
        .attr('max-width', function (d) {
            return d.x1 - d.x0;
        })
        .style("font-size", "12px")
        .attr("opacity", "1")
        .text(function (d) {
            1
            if (d.depth == 1) {
                return d.data.id;
            }
        }).call(wrap, 60);

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this)
            var width = text.attr("max-width")
            var words = text.text().split(/\s+/).reverse()
            if (words.length > 3) {
                words = words.slice(Math.max(words.length - 3, 1))

            }
            var word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.2, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
            if (this.childElementCount > 3) {
                text.text(null)
            }
        });
    }

}

function drawRad(id, col) {
    //var hsl = hexToHSL(col)
    if (rad_id == id) {

        //same do nothing
    } else {
        var radData;
        var dString;
        if (id == 'Fed Budget' || id.length == 0) {
            dString = 'data-bar.csv'
        } else {
            dString = 'data-rad.csv'
        }
        d3.csv(dString, function (error, data) {

            if (error) throw error;
            if (id == 'Fed Budget' || id.length == 0) {

            } else {
                data = data.filter(obj => {
                    return obj.Category === id
                })

            }


            var text = "";
            var thickness = 40;
            var duration = 750;
            var padding = 60;
            var opacity = .8;
            var opacityHover = 1;
            var otherOpacityOnHover = .8;
            var tooltipMargin = 13;


            var color = d3.scaleOrdinal(d3.schemeCategory10);

            var colorScale = d3.scaleOrdinal()
                .domain([1, 2, 3, 4, 5, 6])
                .range(d3.schemeCategory20)

            var div = d3.select("#viz-2")
            div.select("svg").remove();
            div.select("div").remove();

            var width = document.getElementById('viz-2').offsetWidth;
            var height = document.getElementById('viz-2').offsetHeight;
            var radius = Math.min(width - padding, height - padding) / 2;
            var svg = div.append('svg')
                .attr('class', 'pie')
                .attr('id', 'pie-svg')
                .attr('width', height)
                .attr('height', height);
            var pWidth = document.getElementById("pie-svg").width.animVal.value;

            var g = svg.append('g')
                .attr('transform', 'translate(' + (pWidth / 2) + ',' + (height / 2) + ')');

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            var pie = d3.pie()
                .value(function (d) {
                    return d.Value;
                })
                .sort(null);

            var path = g.selectAll('path')
                .data(pie(data))
                .enter()
                .append("g")
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .style('opacity', opacity)
                .style('stroke', 'white')

            let legend = d3.select("#viz-2").append('div')
                .attr('class', 'legend');

            let keys = legend.selectAll('.key')
                .data(data)
                .enter().append('div')
                .attr('class', function (d) {
                    if (d.Category) {
                        return "name"
                    } else {
                        return "full"
                    }
                })
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('margin-right', '20px')

            keys.append('div')
                .attr('class', 'symbol')
                .style('height', '15px')
                .style('width', '15px')
                .style('margin', '5px 5px')
                .style('background-color', (d, i) => color(i));

            keys.append('div')
                .text(d => `${d.Desc} ($${d.Value/1000}B)`);

            keys.exit().remove();
        });

        rad_id = id;

    }

}



function drawBar(id, col) {
    //var hsl = hexToHSL(col)
    //console.log(hsl)
    if (bar_id == id) {
        // Same do nothing 
    } else {
        var radData;
        d3.csv("data-bar.csv", function (error, data) {
            if (error) throw error;

            var div = d3.select("#viz-3")
            div.select("svg").remove();
            div.select("div").remove();
            var margin = {
                top: 20,
                right: 30,
                bottom: 30,
                left: 60
            }

            var width = document.getElementById('viz-3').offsetWidth - margin.left - margin.right;
            var height = document.getElementById('viz-3').offsetHeight - margin.top - margin.bottom;
            var padding = 10;
            var svg = div.append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            // set the ranges
            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.2);
            var y = d3.scaleLinear()
                .range([height, 0]);

            // format the data
            data.forEach(function (d) {
                d.Value = +d.Value;
            });

            // Scale the range of the data in the domains
            x.domain(data.map(function (d) {
                return d.Desc;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.Value;
            })]);

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d.Desc);
                })
                .attr("width", x.bandwidth())
                .attr("y", function (d) {
                    return y(d.Value);
                })
                .attr("height", function (d) {
                    return height - y(d.Value);
                }).attr("fill", function (d) {
                    if (d.Desc === id) {
                        return "#FF0033"
                    } else {
                        return "#666666"
                    }
                });;

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("opacity", function (d) {
                    if (d === id) {
                        return 1
                    } else {
                        return 0
                    }
                });

            // add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));
        });

        bar_id = id;

    }


}


function hexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    var HSL = new Object();
    HSL['h'] = h * 360;
    HSL['s'] = Math.round(s * 100);
    HSL['l'] = Math.round(l * 100);
    return HSL;
}
