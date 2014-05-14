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

// the widget definition, where "custom" is the namespace,
// "colorize" the widget name


(function($) {
    $.widget("custom.frame", {
        // default options
        options: {
            title: "New Frame",
            // callbacks
            change: null,
            random: null
        },
        // the constructor
        _create: function() {
            this.element
                    // add a class for theming
                    .addClass("ui-widget-content")
                    .addClass("custom-frame")
                    // prevent double click to select text
                    .disableSelection()
                    .draggable({handle: ".panelTitle"})
                    .resizable({
                        minHeight: "70px",
                        minWidth: "70px"
                    });
            
            
            this.content = this.element.children(".content");
            this.content.css({
                position: "absolute",
                top:"30px",
                bottom:"4px",
                left:"4px",
                right:"4px",
                "overflow-y":"auto"
            });
             
            this.titleComponent = this.element.children(".panelTitle").css({
                "margin": "4px 4px 10px 4px",
                "white-space": "nowrap",
                "padding-left": "5px"
            });

            this.titleComponent
                    .append($("<div/>", {
                        style: "float: right;"
                    })

                            .append($("<button/>", {
                                style: "width:16px;"
                            }).button({
                                class: "btnMinFrame frame-button",
                                style: "width: 16px;",
                                icons: {
                                    primary: "ui-icon-arrowstop-1-s"
                                },
                                text: false
                            }))

                            .append($("<button/>", {
                                style: "width:16px;"
                            }).button({
                                class: "btnCloseFrame frame-button",
                                style: "width: 16px;",
                                icons: {
                                    primary: "ui-icon-closethick"
                                },
                                text: false
                            })));
            
            
            
            

            // bind click events on the changer button to the random method
            this._on(this.element, {
                // _on won't call random when widget is disabled
                "mousedown": "active"
            });
            this._refresh();
        },
        // called when created, and later when changing options
        _refresh: function() {
            this.titleComponent.children(".frame-titleText").text(this.options.title);
        },
        
        
        
        
        // a public method to change the color to a random value
        // can be called directly via .colorize( "random" )
        close: function(event) {

        },
        minimize: function(event) {
            console.log("AAAAAA");
        },
        append: function(dom){
            this.content.append(dom);
        },
        active: function(){
            $(".custom-frame").css("z-index", 1);
            this.element.css("z-index", 30);
        },
        
        
        
        
        
        // events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
        },
        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply(arguments);
            this._refresh();
        },
        // _setOption is called for each individual option that is changing
        _setOption: function(key, value) {
            this._super(key, value);
        }
    });
})(jQuery);


