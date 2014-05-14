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
    $.widget("custom.collapsibleList", {
        // default options
        options: {},
        // the constructor
        _create: function() {
            this.element.disableSelection()
                    .on("click", ".collapsible, .collTitle", function(e) {
                        if (e.target === this) {
                            var obj = $(this);
                            if (obj.attr("class") === "collapsible") {
                                obj.children(".coll").slideToggle();
                            } else {
                                obj.next().slideToggle();
                            }

                        }
                    });
            this._refresh();
        },
        // called when created, and later when changing options
        _refresh: function() {

        },
        // a public method to change the color to a random value
        // can be called directly via .colorize( "random" )
        close: function(event) {

        },
        minimize: function(event) {
            console.log("AAAAAA");
        },
        append: function(dom) {
    this.content.append(dom);
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