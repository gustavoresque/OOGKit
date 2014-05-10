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

    var ajust = 30;
    var width = window.innerWidth - ajust, height = window.innerHeight - ajust;
//    var width = 600, height = 350;

//    var force = d3.layout.force()
//            .charge(-100)
//            .size([width, height]);

    var svg = d3.select("body").append("svg")
            .attr("width", width + ajust)
            .attr("height", height + ajust)
            //        .call(dragCanvas)
            ;


    window.onresize = function() {
        width = window.innerWidth - ajust;
        height = window.innerHeight - ajust;

        svg.attr("width", width + ajust)
                .attr("height", height + ajust);
    };

    var x = width / 2, y = height / 2;
//    var data = [{"text": "dress", "frequency": 4}, {"text": "training", "frequency": 4}, {"text": "babysitting", "frequency": 3}, {"text": "recommendations", "frequency": 3}, {"text": "opportunity", "frequency": 3}, {"text": "anyone", "frequency": 3}, {"text": "have", "frequency": 3}, {"text": "undefined", "frequency": 2}, {"text": "success", "frequency": 2}, {"text": "does", "frequency": 2}, {"text": "impress", "frequency": 2}, {"text": "craft", "frequency": 1}, {"text": "you", "frequency": 1}, {"text": "sweater", "frequency": 1}, {"text": "someone", "frequency": 1}, {"text": "joke", "frequency": 1}, {"text": "catering", "frequency": 1}, {"text": "chance", "frequency": 1}, {"text": "first", "frequency": 1}, {"text": "question", "frequency": 1}, {"text": "impression", "frequency": 1}, {"text": "make", "frequency": 1}, {"text": "never", "frequency": 1}, {"text": "second", "frequency": 1}, {"text": "me", "frequency": 1}, {"text": "missing", "frequency": 1}, {"text": "next", "frequency": 1}, {"text": "night", "frequency": 1}, {"text": "week", "frequency": 1}, {"text": "funny", "frequency": 1}, {"text": "cover", "frequency": 1}, {"text": "club", "frequency": 1}, {"text": "coupon", "frequency": 1}, {"text": "bake", "frequency": 1}, {"text": "charity", "frequency": 1}, {"text": "need", "frequency": 1}, {"text": "sale", "frequency": 1}, {"text": "get", "frequency": 1}, {"text": "volunteers", "frequency": 1}, {"text": "help", "frequency": 1}, {"text": "project", "frequency": 1}, {"text": "time", "frequency": 1}];
    var data = [{"text": "GT-SeismicProcessorPro Bug Report", "frequency": 37}, {"text": "Inspection request for site", "frequency": 12}, {"text": "New refueling policies - Effective February 1", "frequency": 12}, {"text": "Route suggestion for next shift", "frequency": 23}, {"text": "Upcoming birthdays", "frequency": 3}, {"text": "Don't text and drive!", "frequency": 22}, {"text": "Service anniversary", "frequency": 6}, {"text": "Patrol schedule changes", "frequency": 2}, {"text": "Wellhead flow rate data", "frequency": 25}, {"text": "Plants", "frequency": 17}, {"text": "IPO", "frequency": 5}, {"text": "Craft night", "frequency": 6}, {"text": "Favor - borrow hedge trimmer", "frequency": 16}, {"text": "Facilities preparations for VIP visit", "frequency": 13}, {"text": "Question - Protocol for VIP visit", "frequency": 2}, {"text": "Concert tickets", "frequency": 2}, {"text": "Supplies", "frequency": 7}, {"text": "Congratulations on your service anniversary", "frequency": 4}, {"text": "Meeting", "frequency": 4}, {"text": "Late for meeting", "frequency": 27}, {"text": "Are you buying coffee?", "frequency": 12}, {"text": "All staff announcement", "frequency": 1}, {"text": "Good morning, GasTech!", "frequency": 6}, {"text": "Service anniversaries!", "frequency": 3}, {"text": "Traffic advisory for today", "frequency": 24}, {"text": "List of repairs needed", "frequency": 13}, {"text": "Hey, I�m going home sick.", "frequency": 8}, {"text": "Dress for success - Dress to impress", "frequency": 7}, {"text": "Files", "frequency": 15}, {"text": "This weekend?", "frequency": 3}, {"text": "Works for me, thanks", "frequency": 4}, {"text": "Daily morning announcements", "frequency": 4}, {"text": "Karoake night", "frequency": 1}, {"text": "Downhole prediction 2522-00", "frequency": 11}, {"text": "I�m in! - post a list", "frequency": 4}, {"text": "Document stuck", "frequency": 6}, {"text": "Yearly numbers looking good", "frequency": 12}, {"text": "No hurry", "frequency": 6}, {"text": "Wellhead flow rate data - overpressure at well 1783-03?", "frequency": 13}, {"text": "Catering?!?", "frequency": 10}, {"text": "Resolution of incident", "frequency": 7}, {"text": "Well 1033-01 stabilization progress report", "frequency": 5}, {"text": "Downhole prediction 2522-00 - check your parameters", "frequency": 6}, {"text": "Mandatory safety training", "frequency": 10}, {"text": "Can someone cover for me next week?", "frequency": 3}, {"text": "Too funy - you have to see this...", "frequency": 11}, {"text": "Planning for staff picnic", "frequency": 5}, {"text": "Need a ride to lunch later", "frequency": 9}, {"text": "Money for coffee fund", "frequency": 5}, {"text": "Be Careful!", "frequency": 8}, {"text": "Safety First!", "frequency": 14}, {"text": "Caution downtown", "frequency": 10}, {"text": "Impact of Kronos politics on upcoming rollout", "frequency": 8}, {"text": "Staff still leaving computers unlocked when they leave at the day", "frequency": 3}, {"text": "Babysitting recommendations", "frequency": 15}, {"text": "Union meeting", "frequency": 11}, {"text": "Downhole prediction 2522-00 - updated", "frequency": 5}, {"text": "Who�s tracking the office pool", "frequency": 9}, {"text": "Anyone have a spare monitor?", "frequency": 5}, {"text": "Paid holiday reminders", "frequency": 1}, {"text": "Suggest topics for upcoming retreat", "frequency": 5}, {"text": "Vistors from Tethys", "frequency": 4}, {"text": "Awwww- cute!", "frequency": 12}, {"text": "Question - new travel forms", "frequency": 4}, {"text": "Parking lottery winners", "frequency": 2}, {"text": "Vacation donation request", "frequency": 4}, {"text": "Notification of outside visit", "frequency": 6}, {"text": "Does anyone have ...", "frequency": 9}, {"text": "Field work rotation schedule", "frequency": 25}, {"text": "GT website under attack", "frequency": 2}, {"text": "Question about behavior of field device", "frequency": 9}, {"text": "Funny!!", "frequency": 25}, {"text": "Impact of local politics on profit margin", "frequency": 12}, {"text": "Can anyone swap on-call slots with me?", "frequency": 2}, {"text": "Security patches needed", "frequency": 7}, {"text": "Tools", "frequency": 15}, {"text": "Security procedures for January 20 VIP visit", "frequency": 16}, {"text": "You never get a second chance to make a first impression", "frequency": 6}, {"text": "Software review report", "frequency": 7}, {"text": "Remember Casino night!", "frequency": 6}, {"text": "Security update: how to handle reporters on the grounds", "frequency": 4}, {"text": "GIS update", "frequency": 27}, {"text": "They need that report today", "frequency": 3}, {"text": "Impromptu golf vacation - who's in?", "frequency": 3}, {"text": "Missing sweater", "frequency": 2}, {"text": "2516-00 openhole logging results", "frequency": 10}, {"text": "Changes to travel policy", "frequency": 5}, {"text": "Out of staples", "frequency": 5}, {"text": "Hardware failures", "frequency": 3}, {"text": "Concert", "frequency": 4}, {"text": "Equipment calibration", "frequency": 4}, {"text": "No problem", "frequency": 1}, {"text": "Copier", "frequency": 4}, {"text": "Reception after the corporate meeting Monday morning", "frequency": 3}, {"text": "Downhole logging scheduled for 2516-00", "frequency": 2}, {"text": "Still busy?", "frequency": 1}, {"text": "Training opportunity", "frequency": 13}, {"text": "Joke - funny!", "frequency": 3}, {"text": "Anyone have time to help troubleshoot some software?", "frequency": 11}, {"text": "Need volunteers - charity bake sale", "frequency": 3}, {"text": "Who took the toolbox out of my truck?", "frequency": 17}, {"text": "GASTech announcements", "frequency": 4}, {"text": "Updated assignments", "frequency": 4}, {"text": "New gyro place opened nearby", "frequency": 1}, {"text": "Coupon club", "frequency": 6}, {"text": "Watch found", "frequency": 5}, {"text": "Web site", "frequency": 6}, {"text": "Vacation scheduling procedures", "frequency": 8}, {"text": "Who's up for lunch?", "frequency": 6}, {"text": "Recommendations for a good investment advisor?", "frequency": 4}, {"text": "The rest of the files are in your mailbox", "frequency": 7}, {"text": "Did you like the flowers?", "frequency": 2}, {"text": "How to Prepare for the January 20 VIP Meetings", "frequency": 4}, {"text": "Have you seen this? New security tool", "frequency": 6}, {"text": "HASR Injection Progress", "frequency": 5}, {"text": "Training question", "frequency": 2}, {"text": "Cased-hole inspection schedule", "frequency": 3}, {"text": "Spam reports", "frequency": 2}, {"text": "Managing perceptions about the IPO", "frequency": 16}, {"text": "Anyone have time to help on a project?", "frequency": 4}, {"text": "When you have a minute", "frequency": 5}, {"text": "2497-00 Initial flow rates", "frequency": 5}, {"text": "Recommend a good vacation spot?", "frequency": 8}, {"text": "News on VIP Visit January 20 - Please Read!", "frequency": 3}, {"text": "2497-00 Perforation", "frequency": 2}, {"text": "Guys night out - sorry, ladies", "frequency": 22}, {"text": "Testing 1 2 3", "frequency": 1}, {"text": "Hackathon Friday night - my place", "frequency": 7}, {"text": "FW: ARISE - Inspiration for Defenders of Kronos", "frequency": 5}, {"text": "Action: Review network logs", "frequency": 6}, {"text": "Mandatory training", "frequency": 4}, {"text": "Patch status", "frequency": 4}, {"text": "Seeing strange network activity", "frequency": 6}, {"text": "Take a look at this", "frequency": 3}, {"text": "Man your battlestations!", "frequency": 7}, {"text": "Can someone verify this behavior?", "frequency": 8}, {"text": "Operational efficiencies", "frequency": 3}, {"text": "Maximizing quarterly profits", "frequency": 7}, {"text": "Action: Virus detected on your system", "frequency": 8}, {"text": "Conference report", "frequency": 15}, {"text": "Article - interesting", "frequency": 6}, {"text": "Updated Safety Policies", "frequency": 5}, {"text": "The most creative spam I've seen lately.", "frequency": 11}, {"text": "Ha ha", "frequency": 10}, {"text": "On my way", "frequency": 2}, {"text": "Draft report - comments needed by Monday", "frequency": 7}, {"text": "Favor - water plants please next month", "frequency": 6}, {"text": "Reminder: Refer all media inquiries", "frequency": 5}, {"text": "Going home sick", "frequency": 5}, {"text": "New hardware - advice needed?", "frequency": 3}, {"text": "Employee of the month", "frequency": 4}, {"text": "Equipment audit approaching", "frequency": 4}, {"text": "Deadline changed?", "frequency": 2}, {"text": "Overtime policy reminder", "frequency": 1}, {"text": "Registration open: retirement planning seminar", "frequency": 3}, {"text": "NO DECAF - HA HA", "frequency": 5}, {"text": "Reorganization", "frequency": 3}]
    var links = [];
    for (var i = 1; i < data.length; i++) {
        links.push({source: i - 1, target: i});
    }

    var maxFreq = Math.max.apply(Math, data.map(function(obj) {
        return obj["frequency"];
    }));

//    force.nodes(data).links([]).start();




    var words = svg.selectAll(".words").data(data).enter()
            .append("svg:text")
            .text(function(d) {
                return d.text;
            })
            .attr("font-family", "Serif")
            .attr("font-size", function(d) {
                return Math.sqrt(d.frequency) * 4.5 + 8;
            })
            .sort(function(a, b) {
                return b.frequency - a.frequency;
            })
            .attr("fill", function(d) {
                return "rgba(0,0,0," + (1 - d.frequency / maxFreq) + ")";
            })
            .attr("stroke", function(d) {
                return "rgba(0,0,0," + (d.frequency / maxFreq) + ")";
            })
            .attr("stroke-width", function(d) {
                return d.frequency / maxFreq + 0.5;
            })
            .attr("x", function(d) {
                d.x = (width / 2) - (this.getBBox().width / 2);
                return d.x;
            })
            .attr("y", function(d) {
                d.y = (height / 2) + (this.getBBox().height / 2);
                return d.y;
            });
//            .call(force.drag);

    words.each(function(d) {
        d.h = this.getBBox().height;
        d.w = this.getBBox().width;
    });


//    force.on("tick", function() {
//        inter = false;
//        var q = d3.geom.quadtree(data),
//                i = 0,
//                n = data.length;
//
//
//        while (++i < n) {
//            q.visit(collide(data[i]));
//        }
//
//
//        words.attr("x", function(d) {
//            return d.x;
//        }).attr("y", function(d) {
//            return d.y;
//        });
//        if(inter){
//            force.alpha(0.02);
//        }else{
//            force.alpha(0);
//        }
//        
//
//    });
//    force.start();
//    while(inter){
//        force.tick();
//    }
//    force.stop();

//    function collide(node) {
////        console.log(this);
//        var nx1 = node.x,
//                nx2 = node.x + node.w,
//                ny1 = node.y,
//                ny2 = node.y + node.h;
//
//        return function(quad, x1, y1, x2, y2) {
//            if (quad.point && (quad.point !== node)) {
//
//
//                var area = intersectArea(node, quad.point);
//                if (area) {
//                    var aux = Math.log(area);
//                    if (node.x > quad.point.x) {
//                        node.x += aux;
//                        quad.point.x -= aux;
//                    } else {
//                        node.x -= aux;
//                        quad.point.x += aux;
//                    }
//                    if (node.y > quad.point.y) {
//                        node.y += aux;
//                        quad.point.y -= aux + 0.4;
//                    } else {
//                        node.y -= aux;
//                        quad.point.y += aux + 0.4;
//                    }
//                }
//            }
//            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//        };
//    }


    var interval = setInterval(function() {
        var inter = false;
        words.each(function(d) {
            words.each(function(d2) {
//                var a = intersectArea(d, d2);
                if (d !== d2 && intersectRect(d, d2)) {

                    inter = true;
                    var aux = 1.9;
                    if (d.x > d2.x) {
                        d.x += d.x + d.w < width ? aux : 0;
                        d2.x -= d2.x > 0 ? aux : 0;
                    } else {
                        d.x -= d.x > 0 ? aux : 0;
                        d2.x += d2.x + d2.w < width ? aux : 0;
                    }
                    if (d.h > d2.h) {
                        d.y += d.y < height ? aux : 0;
                        d2.y -= d2.y - d2.h > 0 ? aux : 0;
                    } else if (d.h < d2.h) {
                        d.y -= d.y - d.h > 0 ? aux : 0;
                        d2.y += d2.y < height ? aux : 0;
                    } else {
                        if (d.w > d2.w) {
                            d.y += d.y < height ? aux : 0;
                            d2.y -= d2.y - d2.h > 0 ? aux : 0;
                        } else {
                            d.y -= d.y - d.h > 0 ? aux : 0;
                            d2.y += d2.y < height ? aux : 0;
                        }

                    }
                }

            });
        });

        words.attr("x", function(d) {
            return d.x;
        }).attr("y", function(d) {
            return d.y;
        });

        if (!inter) {
            console.log("inter - clear");
            clearInterval(interval);
        }
    }, 30);

    console.log(interval);

    function intersectRect(r1, r2) {
        return !(r2.x > (r1.x + r1.w) ||
                (r2.x + r2.w) < r1.x ||
                r2.y - r2.h > r1.y ||
                r2.y < r1.y - r2.h);
    }
//    function intersectArea(r1, r2) {
//        var dx1 = r2.x + r2.w - r1.x;
//        var dx2 = r1.x + r1.w - r2.x;
//        var dy1 = r1.y - r2.y + r2.h;
//        var dy2 = r1.y - r1.y + r1.h;
//        var dx, dy, wMax = Math.max(r1.w, r2.w), hMax = Math.max(r1.h, r2.h);
//        dx = (dx1 >= 0 && dx1 <= wMax) ? dx1 : ((dx2 >= 0 && dx2 <= wMax) ? dx2 : undefined);
//        dy = (dy1 >= 0 && dy1 <= hMax) ? dy1 : ((dy2 >= 0 && dy2 <= hMax) ? dy2 : undefined);
//        if (dx && dy) {
//            return dx * dy;
//        }
//    }

})(d3);











