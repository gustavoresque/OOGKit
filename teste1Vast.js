/* 
 * Copyright (C) 2014 Gustavo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


(function(d3) {
    var width = window.innerWidth - 5, height = window.innerHeight - 5;



    var color = d3.scale.category20();
    var tx = 0, ty = 0, ctrlPressed = false;

    var force = d3.layout.force()
            .charge(-10020)
            .linkDistance(30)
            .size([width, height]);

    var zoom = d3.behavior.zoom()
            .scaleExtent([0, 600])
            .on("zoom", zoomFunction);

    function zoomFunction(d) {
//                    d3.select(".graph").attr("transform", "scale(" + s + "," + s + ")");
        if (!d3.event.sourceEvent.ctrlKey) {
            d3.select(".graph").attr("transform", "translate(" +
                    d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
    }

    document.onkeydown = function(e) {
        if (e.keyCode === 17) {
            svg.style("cursor", "default");
        }
        console.log(e.keyCode);
    };
    document.onkeyup = function(e) {
        if (e.keyCode === 17) {
            svg.style("cursor", "move");
        }
    };

//                var dragCanvas = d3.behavior.drag().on("drag", function(d) {
//                    tx += d3.event.dx;
//                    ty += d3.event.dy;
//                    d3.select("g.graph").attr("transform", "translate(" + tx + "," + ty + ")");
//                });

    var dragNode = d3.behavior.drag().on("drag", function(d, i) {
        force.stop();
        var v = d3.select(this);
        v.attr("cx", parseFloat(v.attr("cx")) + d3.event.dx)
                .attr("cy", parseFloat(v.attr("cy")) + d3.event.dy);

        var filteredLinks = d3.selectAll(".link").filter(function(d, j) {
            if (d.source.index === i || d.target.index === i) {
                return true;
            } else {
                return false;
            }
        });

//                            console.log(filteredLinks.size());
        filteredLinks.attr("x1", function(d) {
            if (d.source.index === i) {
                return v.attr("cx");
            } else {
                return d3.select(this).attr("x1");
            }
        }).attr("y1", function(d) {
            if (d.source.index === i) {
                return v.attr("cy");
            } else {
                return d3.select(this).attr("y1");
            }
        }).attr("x2", function(d) {
            if (d.target.index === i) {
                return v.attr("cx");
            } else {
                return d3.select(this).attr("x2");
            }
        }).attr("y2", function(d) {
            if (d.target.index === i) {
                return v.attr("cy");
            } else {
                return d3.select(this).attr("y2");
            }
        });
    });

    var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom)
            //        .call(dragCanvas)
            ;

    window.onresize = function() {
        svg.attr("width", window.innerWidth - 5)
                .attr("height", window.innerHeight - 5);
    };



    d3.json("data3.json", function(error, graph) {
        force.nodes(graph.nodes)
                .links(graph.links)
                .start();


        var grafo = svg.append("svg:g").attr("class", "graph");


        var link = grafo.selectAll(".link").data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) {
                    return Math.sqrt(d.weight);
                });

        var nodeGroup = grafo.selectAll("g.node")
                .data(graph.nodes).enter()
                .append("svg:g").attr("class", "node")
                ;

        var node = nodeGroup.append("circle")
//                            .attr("r", function(d){
//                                return d.group;
//                            })
                .style("fill", function(d){
                    return color(d.employmentType);
                })
//                            .attr("r", function(d){
//                                return d.group+1;
//                            })
                .attr("r", 7)
//                            .style("fill", function(d) {
//                                return color(d.group);
//                            })
                .call(dragNode);



        node.append("title").text(function(d) {
            return d.email + "\n" + d.employment + "\n" + d.employmentType;
        });

//                    var label = nodeGroup.append("text").text(function(d, i) {
//                        return "" + i;
//                    }).attr("class", "label");

        force.on("tick", function() {

            link.attr("x1", function(d) {
                return d.source.x;
            }).attr("y1", function(d) {
                return d.source.y;
            }).attr("x2", function(d) {
                return d.target.x;
            }).attr("y2", function(d) {
                return d.target.y;
            });


            node.attr("cx", function(d) {
                return d.x;
            }).attr("cy", function(d) {
                return d.y;
            });

//                        label.attr("x", function(d, i) {
//                            return d.x - 4;
//                        }).attr("y", function(d, i) {
//                            return d.y + 3;
//                        });


        });



    });
})(d3);



