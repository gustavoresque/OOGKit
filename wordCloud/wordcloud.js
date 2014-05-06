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

(function() {


    var width = window.innerWidth - 5, height = window.innerHeight - 5;


    var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            //        .call(dragCanvas)
            ;

    window.onresize = function() {
        svg.attr("width", window.innerWidth - 5)
                .attr("height", window.innerHeight - 5);
    };
    
    
    


})();











