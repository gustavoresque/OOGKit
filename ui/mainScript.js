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

(function($) {

    $(document).ready(function() {

        var graphOpt = {
            vertex: {
                fill: undefined,
                r: undefined,
                stroke: undefined,
                "stroke-width": undefined
            },
            edge: {
                stroke: undefined,
                "stroke-width": undefined
            }
        };

        $("#GraphFrameOpts").frame({title: "Opções - Grafo"})
                .position({
                    my: "left top",
                    at: "left bottom",
                    of: $("#mainMenu")
                })
                .width(200)
                .height(420);

        $(".accordeon").accordion({
            heightStyle: "content"
        });

        $("#collapseList").collapsibleList();
        $("#GraphFrame").frame({title: "Grafo"}).css({
            top: "34px",
            left: "210px",
            right: "6px",
            bottom: "6px"
        });


        $("#GraphFrameOpts").on("change", "select", function() {
            var obj = $(this);
            var attr = obj.attr("data-attr");
            var opt = obj.children("option:selected");
            graphOpt["vertex"][attr] = opt.attr("data-value");
            update();
//            console.log(graphOpt["vertex"][attr]);
        });


        var node, color, link;
        function update() {
            node
                    .style("fill", function(d) {
                        if (graphOpt.vertex.fill) {
                            return color(d[graphOpt.vertex.fill]);
                        } else {
                            return "black";
                        }
                    })
                    .style("stroke", function(d) {
                        if (graphOpt.vertex.stroke) {
                            return color(d[graphOpt.vertex.stroke]);
                        } else {
                            return "black";
                        }
                    })
                    .style("stroke-width", function(d) {
                        if (graphOpt.vertex.stroke) {
                            return 3;
                        } else {
                            return 0;
                        }
                    })
                    .attr("r", function(d) {
                        if (graphOpt.vertex.r) {
                            return 10;
                        } else {
                            return 15;
                        }
                    });
        }

        //D3

        (function(d3) {

            var width = $("#graphCanvas").width() - 5, height = $("#graphCanvas").height() - 5;



            color = d3.scale.category20();
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

            var svg = d3.select("#graphCanvas").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .call(zoom)
                    //        .call(dragCanvas)
                    ;

//            window.onresize = function() {
//                svg.attr("width", window.innerWidth - 5)
//                        .attr("height", window.innerHeight - 5);
//            };



            d3.json("../data3.json", function(error, graph) {

                var nodeOpts = graph.nodes[0];
                var selects = $("#form-vertex-opts").find("select");
                selects.html($("<option/>", {
                    text: "Nenhum",
                    "data-value": undefined
                }));
                for (var prop in nodeOpts) {
                    selects.append($("<option/>", {
                        text: prop,
                        "data-value": prop
                    }));
                }


                force.nodes(graph.nodes)
                        .links(graph.links)
                        .start();




                var grafo = svg.append("svg:g").attr("class", "graph");


                link = grafo.selectAll(".link").data(graph.links)
                        .enter().append("line")
                        .attr("class", "link")
                        .style("stroke-width", function(d) {
                            return Math.sqrt(d.weight);
                        });

                var nodeGroup = grafo.selectAll("g.node")
                        .data(graph.nodes).enter()
                        .append("svg:g").attr("class", "node")
                        ;

                node = nodeGroup.append("circle")
//                            .attr("r", function(d){
//                                return d.group;
//                            })
                        .style("fill", function(d) {
                            if (graphOpt.vertex.fill) {
                                return color(d[graphOpt.vertex.fill]);
                            } else {
                                return "black";
                            }
                        })
//                            .attr("r", function(d){
//                                return d.group+1;
//                            })
                        .attr("r", function(d) {
                            if (graphOpt.vertex.r) {
                                return color(d[graphOpt.vertex.r]);
                            } else {
                                return 7;
                            }
                        })
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



    });

})(jQuery);

