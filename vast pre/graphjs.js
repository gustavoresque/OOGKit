


/**
 * 
 * 
 * Type Edge {
 *      v1: Object,
 *      v2: Object,
 *      i1: number,
 *      i2: number,
 *      weight: number,
 * }
 */

var GraphJs = (function() {


    function Graph(implementation, oriented, adjs) {

        this.isOriented = oriented ? true : false;
        this.implementation = implementation;

        switch (implementation) {
            case "matrix":
                setMatrixImpl(this);
                break;
            case "list":
                setListImpl(this);
                break;
            default:
                //A implementação default é lista.
                setListImpl(this);
                break;
        }

        if (typeof adjs === "string") {
//            var finds = adjs.match(/\d+\-\d+/g);
//            var edge, v1, v2, vCount = -1;
//            for (var i = 0; i < finds.length; i++) {
//                edge = finds[i].split("-");
//                v1 = parseInt(edge[0]);
//                v2 = parseInt(edge[1]);
//                if (v1 >= 0 && v2 >= 0) {
//                    while (v1 > vCount || v2 > vCount) {
//                        this.insertVertex();
//                        vCount++;
//                    }
//                    this.insertEdge(v1, v2);
//                }
//            }
            var reg = /(\d+)\-(\d+)(\[(\-?\d+)\])?/g;
            var finds;
            var v1, v2, vCount = -1, weight;
            while ((finds = reg.exec(adjs)) !== null) {
                v1 = parseInt(finds[1]);
                v2 = parseInt(finds[2]);
                weight = parseInt(finds[4]);
                if (v1 >= 0 && v2 >= 0) {
                    while (v1 > vCount || v2 > vCount) {
                        this.insertVertex();
                        vCount++;
                    }
                    if (weight) {
                        this.insertEdge(v1, v2, weight);
                    } else {
                        this.insertEdge(v1, v2);
                    }
                }
            }
        }

    }

    var Search = {
        //Busca em Profundidade.
        depthFirst: function() {


            var graph = this;

            if (arguments.length === 1 && typeof arguments[0] === 'function') {
                if (this.getNumVertices() > 0) {
                    Search.depthFirst.call(this, 0, "pre", arguments[0]);
                }
            } else if (typeof arguments[0] === 'number' && typeof arguments[1] === 'string' && typeof arguments[2] === 'function') {
                if (this.existsVertex(arguments[0])) {
                    var discoverCount = [], stack = [], count = 0, treeCount = 0;
                    graph.forEachVertex(function() {
                        discoverCount.push(-1);
                    });
                    var callback = arguments[2], initV = arguments[0], pre = arguments[1] === "pre" ? true : false;
                    df(initV);
                    graph.forEachVertex(function(i) {
                        if (i !== initV) {
                            df(i);
                        }
                    });
                    function df(v) {
                        if (discoverCount[v] < 0) {
                            discoverCount[v] = count++;
                            if (pre) {
                                callback(v, graph.getVertex(v), "tree", stack, treeCount);
                            }
                            stack.push(v);
                            var adjs = graph.getIndicesOfAdjs(v);
                            for (var i = 0; i < adjs.length; i++) {
                                df(adjs[i]);
                            }
                            if (!pre) {
                                callback(v, graph.getVertex(v), "tree", stack, treeCount);
                            }
                            stack.pop();
                        } else if (stack.indexOf(v) >= 0) {
                            callback(v, graph.getVertex(v), "back", stack, treeCount);
                        } else if (discoverCount[v] < discoverCount[stack[stack.length - 1]]) {
                            callback(v, graph.getVertex(v), "cross", stack, treeCount);
                        } else {
                            callback(v, graph.getVertex(v), "forward", stack, treeCount);
                        }
                    }
                }
            } else if (typeof arguments[0] === 'object' && typeof arguments[1] === 'function') {
                var i = this.indexOfVertex(arguments[0]);
                if (i >= 0) {
                    Search.depthFirst.call(this, i, "pre", arguments[2]);
                }
            } else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
                if (arguments[0] === "pre" || arguments[0] === "pos") {
                    Search.depthFirst.call(this, 0, arguments[0], arguments[1]);
                }
            }




        },
        //Busca em largura.
        breadthFirst: function() {
            if (arguments.length === 1 && typeof arguments[0] === 'function') {
                if (this.getNumVertices() > 0) {
                    Search.breadthFirst.call(this, 0, arguments[0]);
                }
            } else if (typeof arguments[0] === 'number' && typeof arguments[1] === 'function') {
                if (this.existsVertex(arguments[0])) {
                    var discovered = [], queue = [], v, count = [], treeCount = 0;
                    this.forEachVertex(function() {
                        discovered.push(false);
                        count.push(Infinity);
                    });
                    var graph = this, callback = arguments[1];
                    count[arguments[0]] = 0;
                    bf(arguments[0]);
                    this.forEachVertex(function(i) {
                        if (!discovered[i]) {
                            treeCount++;
                            count[i] = 0;
                            bf(i);
                        }
                    });

                    function bf(i) {
                        queue.push(i);
                        while (queue.length > 0) {
                            v = queue.shift();
                            if (!discovered[v]) {
                                discovered[v] = true;
                                callback(v, graph.getVertex(v), count[v], treeCount, i);
                                var adjs = graph.getIndicesOfAdjs(v);
                                for (var j = 0; j < adjs.length; j++) {
                                    if (count[adjs[j]] > count[v] + 1) {
                                        count[adjs[j]] = count[v] + 1;
                                    }
                                }
                                queue = queue.concat(adjs);
                            }
                        }
                    }

                }
            } else if (typeof arguments[0] === 'object' && typeof arguments[1] === 'function') {
                var i = this.indexOfVertex(arguments[0]);
                if (i >= 0) {
                    Search.breadthFirst.call(this, i, arguments[1]);
                }
            }
        },
        //Algoritmo de Dijkstra.
        dijkstra: function() {
            if (typeof arguments[0] === "number") {
                var priority;
                var dist = [], source = arguments[0];
                //decide qual estrutura de dados usar.
                if (arguments[1]) {
                    //console.log("custom priority structure");
                    priority = arguments[1];
                    priority.comp = function(a, b) {
//                        console.log("comparando "+a+" e "+b);
//                        console.log("ou seja, comparando "+dist[a]+" e "+dist[b]);
                        if (dist[a] > dist[b]) {
                            //console.log("primeiro é maior");
                            return 1;
                        } else if (dist[a] < dist[b]) {
                            //console.log("segundo é maior");
                            return -1;
                        } else {
                            //console.log("são iguais");
                            return 0;
                        }
                    };
                } else {
                    //console.log("default priority structure");
                    priority = {
                        elements: [],
                        pop: function() {
                            var v;
                            for (var i = 1; i < this.elements.length; i++) {
                                if (dist[this.elements[i]] < dist[this.elements[v]]) {
                                    v = i;
                                }
                            }
                            this.length = this.elements.length - 1;
                            return this.elements.splice(v, 1)[0];
                        },
                        push: function(v) {
                            this.elements.push(v);
                            this.length = this.elements.length;
                        },
                        search: function() {
                        },
                        up: function() {
                        }
                    };
                }
                
                var graph = this, v;
                this.forEachVertex(function(i) {
                    dist.push(Infinity);
                    priority.push(i);
                });
                dist[source] = 0;
                var s = priority.search(source);
//                console.log("origem: "+source);
                priority.up(s);
                while (priority.length > 0) {
//                    console.log("while entra ---------->> "+priority.length);
//                    var str ="[ ";
//                    for(var i=0;i<priority.roots.length;i++){
//                        str+=priority.roots[i].value+", ";
//                    }
//                    console.log(str+" ]");
                    v = priority.pop();
                    
//                    console.log("pop "+v +" ovalor mínimo agora é: "+(priority.min!==null?priority.min.value:"null"));
                    var adjs = graph.getIndicesOfAdjs(v);
                    var sumWeight;
                    for (var j = 0; j < adjs.length; j++) {
                        //Considerando que a aresta é um objeto que tem peso (weight).
                        sumWeight = graph.getEdge(v, adjs[j]).weight + dist[v];
                        //Relax
                        if (sumWeight < dist[adjs[j]]) {
                            //doRelax
                            dist[adjs[j]] = sumWeight;
//                            console.log("relaxa!! procurando por: "+adjs[j]);
                            s = priority.search(adjs[j]);
//                            console.log(priority.roots);
                            if(s !== null){
//                                console.log("encontrado!!");
//                                console.log(s);
                                priority.up(s);
                            }else{
//                                console.log("não entrou o "+adjs[j]);
                            }
//                            console.log("sai relaxa -> o valor mínimo agora é: "+priority.min.value+" ["+
//                                    dist[priority.min.value]+"]");
                        }
                    }
                }
//                console.log("while sai  ########################  Fim do algoritmo");
                return dist;
            }
        },
        bellmanford: function() {
            if (arguments.length === 1 && typeof arguments[0] === "number") {
                var source = arguments[0], graph = this;
                var dist = [];
                //Inicializa o grafo
                graph.forEachVertex(function(i) {
                    if (i === source) {
                        dist[i] = 0;
                    } else {
                        dist[i] = Infinity;
                    }
                });

                //Relax Edges
                graph.forEachVertex(function(u) {
                    graph.forEachEdge(function(e, i, j) {
//                        console.log("edge: " + i + " -> " + j);
                        if (dist[i] + e.weight < dist[j]) {
//                            console.log("relax: " + i + " -> " + j);
                            dist[j] = dist[i] + e.weight;
                        }
                    });
                });
                //Se ocorrer mais um relaxamento o grafo contém ciclo negativo
                var negative = false;
                graph.forEachEdge(function(e, i, j) {
                    if ((dist[i] + e.weight) < dist[j]) {
                        negative = true;
                    }
                });
                //Se não retorna o vetor com as distâncias
                return negative? "Graph contains a negative-weight cycle": dist;
            }
        },
        floydwarshall: function() {
            var mtx = [], graph = this, e;
            //Inicialização
            graph.forEachVertex(function(i) {
                mtx.push([]);
                graph.forEachVertex(function(j) {
                    if (i === j) {
                        mtx[i].push(0);
                    } else if ((e = graph.getEdge(i, j))) {
                        mtx[i].push(e.weight);
                    } else {
                        mtx[i].push(Infinity);
                    }
                });
            });

            graph.forEachVertex(function(i) {
                graph.forEachVertex(function(j) {
                    graph.forEachVertex(function(k) {
                        if (mtx[j][i] + mtx[i][k] < mtx[j][k]) {
                            mtx[j][k] = mtx[j][i] + mtx[i][k];
                        }
                    });
                });
            });
            var negative = false;
            graph.forEachVertex(function(i) {
                if(mtx[i][i]<0){
                    negative = true;
                }
            });
            
            return negative? "Graph contains a negative-weight cycle":  mtx;

        }

    };

    var Eulerian = {
        isEulerian: function() {
            var numOdd = 0, g = this;
            this.forEachVertex(function(i, v) {
                if (g.getDegreeOfVertex(i) & 1) {
                    numOdd++;
                }
                if (numOdd > 2) {
                    return false;
                }
            });
            if (numOdd === 0 || numOdd === 2) {
                return true;
            } else {
                return false;
            }
        }
    };




    function GraphFiller(objConfig) {

        var density;
        var isSimple;

        if (objConfig) {
            if (objConfig.density) {
                switch (objConfig.density) {
                    case "sparse":
                        density = objConfig.density;
                        break;
                    case "dense":
                        density = objConfig.density;
                        break;
                    case "medium":
                        density = objConfig.density;
                        break;
                    default :
                        density = "medium";
                        break;
                }
            } else {
                density = "medium";
            }

            if (objConfig.isSimple) {
                isSimple = true;
            } else {
                isSimple = false;
            }
        } else {
            isSimple = true;
            density = "medium";
        }

        this.fillGraph = function(graph) {
            var numV = graph.getNumVertices();
            var isOriented = graph.isOriented;
            var maxE, numE;
            var densityI = -1;
            if (isOriented) {
                maxE = (Math.pow(numV, 2) - numV);
            } else {
                maxE = (Math.pow(numV, 2) - numV) / 2;
            }
            var d = 0.2;
            switch (density) {
                case "sparse":
                    while (densityI < 0 || densityI > 0.75) {
                        densityI = randomNormal() * d;
                    }
                    break;
                case "dense":
                    densityI = randomNormal() * d + 1;
                    while (densityI > 1 || densityI < 0.25) {
                        densityI = randomNormal() * d + 1;
                    }
                    break;
                case "medium":
                    densityI = randomNormal() * d + 0.5;
                    while (densityI < 0.25 || densityI > 0.75) {
                        densityI = randomNormal() * d + 0.5;
                    }
                    break;
            }
            numE = Math.floor(densityI * maxE);



            if (isSimple) {
                var eCount = 0, tryCount = 0, tryMax = numE * 30;
                var v1, v2, p;
                while (eCount < numE) {
                    v1 = Math.floor(Math.random() * numV);
                    v2 = Math.floor(Math.random() * numV);
                    p = Math.floor(Math.random() * numV);
                    if ((!graph.existsEdge(v1, v2)) && v1 !== v2) {
                        graph.insertEdge(v1, v2, p);
                        eCount++;
                    }
                    tryCount++;
                    if (tryCount > tryMax) {
                        densityI = eCount / maxE;
                        break;
                    }
                }

            } else {
                for (var i = 0; i < numE; i++) {
                    v1 = Math.floor(Math.random() * numV);
                    v2 = Math.floor(Math.random() * numV);
                    graph.insertEdge(v1, v2);
                }
            }

            return {
                density: densityI,
                numEdges: numE
            };
        };

        function randomNormal() {
            return Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
        }
    }

    function setListImpl(graph) {
        if (!graph || !graph.setEdge) {


            var list = [];
            var vertices = [];

            graph.getVertex = function(i) {
                //Testa se o tipo dos vertices pretendidos é número ou string
                if (graph.existsVertex(i)) {
                    return vertices[parseInt(i)];
                }
                return null;
            };

            graph.getEdge = function(v1, v2) {
                //Testa se o tipo dos vertices pretendidos é número ou string
                if (typeof v1 === "number" && typeof v2 === "number" &&
                        this.existsVertex(v1) && this.existsVertex(v2)) {

                    var i = parseInt(v1);
                    var j = parseInt(v2);
                    for (var k = 0; k < list[i].length; k++) {
                        if (list[i][k].i2 === j) {
                            return list[i][k];
                        }
                    }
                    return null;

                } else if (typeof v1 === "object" && typeof v2 === "object") {

                    if (graph.existsVertex(v1) && graph.existsVertex(v2)) {
                        var vi = vertices.indexOf(v1);
                        for (var i = 0; i < list[vi].length; i++) {
                            if (list[vi][i].v2 === v2) {
                                return list[vi][i];
                            }
                        }
                    }
                    return null;

                }
            };

            graph.existsVertex = function(i) {
                if (typeof i === "number") {
                    if (i < vertices.length && i >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (typeof i === "object") {
                    if (vertices.indexOf(i) >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };

            graph.existsEdge = function(v1, v2) {
                if (graph.getEdge(v1, v2)) {
                    return true;
                } else {
                    return false;
                }
            };


            graph.insertVertex = function(v) {
                //Caso seja chamado a funcão sem argumentos
                if (!v) {
                    //então chama a função criando um vértice e passando parâmetro.
                    graph.insertVertex({});
                } else {
                    //insere o vértice no grafo.
                    vertices.push(v);
                    //insere sua lista de adjacências
                    list.push([]);
                }
            };

            graph.removeVertex = function(v) {

                if (typeof v === "number") {
                    if (this.existsVertex(v)) {
                        var removedVertex, remI = parseInt(v);
                        //remove o vértice v;

                        list.splice(remI, 1);
                        removedVertex = vertices.splice(remI, 1)[0];

                        //percorre todos vértices resultantes
                        var adjsAux;
                        for (var i = 0; i < list.length; i++) {
                            for (var j = 0; j < list[i]; j++) {
                                if (list[i][j].i2 > remI) {
                                    list[i][j].i2--;
                                } else if (list[i][j].i2 === remI) {
                                    list[i].splice(j, 1);
                                    j--;
                                }
                                if (list[i][j].i1 > remI) {
                                    list[i][j].i1--;
                                }
                            }

                        }
                    }
                } else if (typeof v === "object") {
                    var i = vertices.indexOf(v);
                    if (i >= 0) {
                        graph.removeVertex(i);
                    }
                }

            };


            graph.insertEdge = function(v1, v2, weight) {
                if (!weight) {
                    weight = 1;
                }
                if (this.existsVertex(v1) && this.existsVertex(v2)) {
                    //caso os parametro v1 e v2 sejam núméricos;
                    if (typeof v1 === "number" && typeof v2 === "number") {

                        if (graph.isOriented) {
                            //insere uma aresta de v1 para v2
                            list[v1].push({
                                v1: vertices[v1],
                                v2: vertices[v2],
                                weight: weight,
                                i1: v1,
                                i2: v2
                            });
                        } else {
                            //insere uma aresta de v1 para v2 e outr de v2 para v1.
                            list[v1].push({
                                v1: vertices[v1],
                                v2: vertices[v2],
                                weight: weight,
                                i1: v1,
                                i2: v2
                            });
                            list[v2].push({
                                v1: vertices[v2],
                                v2: vertices[v1],
                                weight: weight,
                                i1: v2,
                                i2: v1
                            });
                        }
                        //caso os parâmetro sejam objetos.
                    } else if (typeof v1 === "object" && typeof v2 === "object") {
                        var iV1 = vertices.indexOf(v1), iV2 = vertices.indexOf(v2);
                        if (iV1 >= 0 && iV2 >= 0) {
                            graph.insertEdge(iV1, iV2);
                        }
                    }
                }
                return false;
            };

            graph.removeEdge = function(v1, v2) {
                if (graph.existsEdge(v1, v2)) {
                    if (typeof v1 === "number" && typeof v2 === "number") {
                        v1 = parseInt(v1);
                        v2 = parseInt(v2);

                        //Caso grafo orientado.
                        //Remove todas as arestas de v1 para v2
                        for (var i = 0; i < list[v1].length; i++) {
                            if (list[v1].i2 === v2) {
                                list[v1].splice(i, 1);
                                i--;
                            }
                        }

                        if (!graph.isOriented) {
                            //Caso o grafo seja não orientado.
                            //Remove todos os vértices de v2 para v1
                            for (var i = 0; i < list[v2].length; i++) {
                                if (list[v2].i2 === v1) {
                                    list[v2].splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    } else if (typeof v1 === "object", typeof v2 === "undefined") {
                        for (var i = 0; i < list.length; i++) {
                            var iEdge = list[i].indexOf(v1);
                            if (iEdge >= 0) {
                                list[i].splice(iEdge, 1);
                            }
                        }
                    }
                }


            };

            graph.indexOfVertex = function(v) {
                return vertices.indexOf(v);
            };


            graph.getAdjsOfVertex = function(v) {
                if (graph.existsVertex(v)) {
                    if (typeof v === "number") {
                        var adjs = [];
                        v = parseInt(v);
                        for (var i = 0; i < list[v].length; i++) {
                            adjs.push(list[v][i].v2);
                        }
                        return adjs;
                    } else if (typeof v === "object") {
                        var i = vertices.indexOf(v);
                        if (i >= 0) {
                            return graph.getAdjsOfVertex(i);
                        }
                    }
                }
            };

            graph.getIndicesOfAdjs = function(v) {
                if (graph.existsVertex(v)) {
                    if (typeof v === "number") {
                        var adjs = [];
                        v = parseInt(v);
                        for (var i = 0; i < list[v].length; i++) {
                            adjs.push(list[v][i].i2);
                        }
                        return adjs;
                    } else if (typeof v === "object") {
                        var i = vertices.indexOf(v);
                        if (i >= 0) {
                            return graph.getAdjsOfVertex(i);
                        }
                    }
                }
            };

            graph.getNumVertices = function() {
                return vertices.length;
            };

            graph.print = function() {
                var row = "";
                for (var i = 0; i < list.length; i++) {
                    row = "";
                    row += i + " -> ";
                    for (var j = 0; j < list[i].length; j++) {
                        row += list[i][j].i2 + ", ";
                    }
                    console.log(row);
                }
            };

            graph.forEachVertex = function(func) {
                for (var i = 0; i < vertices.length; i++) {
                    func(i, vertices[i]);
                }
            };

            graph.forEachEdge = function(func) {
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < list[i].length; j++) {
                        func(list[i][j], i, list[i][j].i2);
                    }
                }
            };

            graph.toString = function() {
                var str = "";
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < list[i].length; j++) {
                        if (list[i][j].i2 >= i) {
                            str += i + "-" + list[i][j].i2 + "["+list[i][j].weight+"]"+",";
                        }
                    }
                }
                return str;
            };

            graph.getDegreeOfVertex = function(v) {
                if (typeof v === "number") {
                    if (v >= 0 && v < vertices.length) {
                        return list[v].length;
                    }
                } else if (typeof v === "object") {
                    return graph.getDegreeOfVertex(vertices.indexOf(v));
                }
            };



        } else {
            //TODO caso o objeto já tenha uma implementação.
        }
    }

    function setMatrixImpl(graph) {
        if (!graph || !graph.setEdge) {

            var mtx = [];
            var vertices = [];

            graph.getVertex = function(i) {
                if (typeof i === "number") {
                    if (i >= 0 && i < vertices.length) {
                        i = parseInt(i);
                        return vertices[i];
                    }
                } else if (typeof i === "string") {
                    //TODO
                    return null;
                }
                return null;
            };

            graph.getEdge = function(v1, v2) {
                if (typeof v1 === "number" && typeof v2 === "number") {
                    if (v1 >= 0 && v2 >= 0 && v1 < vertices.length && v2 < vertices.length) {
                        v1 = parseInt(v1);
                        v2 = parseInt(v2);
                        return mtx[v1][v2];
                    } else {
                        return null;
                    }
                } else if (typeof v1 === "object" && typeof v2 === "object") {
                    var iV1 = vertices.indexOf(v1);
                    var iV2 = vertices.indexOf(v2);
                    return graph.getEdge(iV1, iV2);
                }
            };

            graph.existsVertex = function(v) {
                if (typeof v === "object" && vertices.indexOf(v) >= 0) {
                    return true;
                } else {
                    if (graph.getVertex(v)) {
                        return true;
                    }
                }
                return false;
            };

            graph.existsEdge = function(v1, v2) {
                if (graph.getEdge(v1, v2)) {
                    return true;
                } else {
                    return false;
                }
            };

            graph.insertVertex = function(v) {
                if (typeof v === "object") {
                    vertices.push(v);
                    var vPos = mtx.length;
                    mtx.push([]);
                    for (var i = 0; i < mtx.length; i++) {
                        mtx[vPos].push(null);
                    }
                    for (var i = 0; i < mtx.length - 1; i++) {
                        mtx[i].push(null);
                    }

                } else if (!v) {
                    graph.insertVertex({});
                }
            };

            graph.removeVertex = function(v) {
                if (typeof v === "number") {
                    if (v >= 0 && v < vertices.length) {
                        mtx.splice(v, 1);
                        for (var i = 0; i < mtx.length; i++) {
                            mtx[i].splice(v, 1);
                        }
                        return vertices.splice(v, 1);
                    }
                } else if (typeof v === "object") {
                    return graph.removeVertex(vertices.indexOf(v));
                }
            };

            graph.insertEdge = function(v1, v2, edgeObj) {

                if (!edgeObj) {
                    edgeObj = {v1: null, v2: null, weight: 1};
                } else if (typeof edgeObj === "number") {
                    edgeObj = {v1: null, v2: null, weight: edgeObj};
                }
                if (typeof v1 === "number" && typeof v2 === "number") {
                    if (v1 >= 0 && v2 >= 0 && v1 < vertices.length && v2 < vertices.length) {
                        v1 = parseInt(v1);
                        v2 = parseInt(v2);
                        edgeObj.v1 = vertices[v1];
                        edgeObj.v2 = vertices[v2];
                        mtx[v1][v2] = edgeObj;
                        if (!graph.isOriented) {
                            //insere duas arestas iguais indicando a volta.
                            mtx[v2][v1] = {v1: vertices[v2], v2: vertices[v1], weight: edgeObj.weight};
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else if (typeof v1 === "object" && typeof v2 === "object") {
                    var iV1 = vertices.indexOf(v1);
                    var iV2 = vertices.indexOf(v2);
                    return graph.insertEdge(iV1, iV2);
                }
            };

            graph.removeEdge = function(v1, v2) {
                if (typeof v1 === "number" && typeof v2 === "number") {
                    if (v1 >= 0 && v2 >= 0 && v1 < vertices.length && v2 < vertices.length) {
                        v1 = parseInt(v1);
                        v2 = parseInt(v2);
                        mtx[v1][v2] = null;
                        if (!graph.isOriented) {
                            mtx[v2][v1] = null;
                        }
                    }
                } else if (typeof v1 === "object" && typeof v2 === "object") {
                    var iV1 = vertices.indexOf(v1);
                    var iV2 = vertices.indexOf(v2);
                    return graph.removeEdge(iV1, iV2);
                }
            };

            graph.indexOfVertex = function(v) {
                if (typeof v === "object") {
                    return vertices.indexOf(v);
                }
                return -1;
            };

            graph.getAdjsOfVertex = function(v) {
                if (graph.existsVertex(v)) {
                    if (typeof v === "number") {
                        var adjs = [];
                        for (var i = 0; i < mtx[v].length; i++) {
                            if (mtx[v][i]) {
                                //insere o vértice da posição da coluna
                                adjs.push(vertices[i]);
                            }
                        }
                        return adjs;
                    } else if (typeof v === "object") {
                        return graph.getAdjsOfVertex(vertices.indexOf(v));
                    }
                }
                return -1;
            };

            graph.getIndicesOfAdjs = function(v) {
                if (graph.existsVertex(v)) {
                    if (typeof v === "number") {
                        var adjs = [];
                        for (var i = 0; i < mtx[v].length; i++) {
                            if (mtx[v][i]) {
                                //insere o vértice da posição da coluna
                                adjs.push(i);
                            }
                        }
                        return adjs;
                    } else if (typeof v === "object") {
                        return graph.getAdjsOfVertex(vertices.indexOf(v));
                    }
                }
                return -1;
            };

            graph.getNumVertices = function() {
                return vertices.length;
            };

            graph.print = function() {

                var row = "    ";
                for (var i = 0; i < vertices.length; i++) {
                    row += i + "  ";
                }
                console.log(row);

                for (var i = 0; i < mtx.length; i++) {
                    row = i + "  ";
                    if (i < 10) {
                        row += " ";
                    }
                    for (var j = 0; j < mtx[i].length; j++) {
                        if (mtx[i][j]) {
                            row += mtx[i][j].weight + (j < 10 ? "  " : "   ");
                        } else {
                            row += j < 10 ? "-  " : "-   ";
                        }
                    }
                    console.log(row);
                }
            };

            graph.forEachVertex = function(func) {
                for (var i = 0; i < vertices.length; i++) {
                    func(i, vertices[i]);
                }
            };

            graph.forEachEdge = function(func) {
                for (var i = 0; i < mtx.length; i++) {
                    for (var j = 0; j < mtx[i].length; j++) {
                        if (mtx[i][j]) {
                            func(mtx[i][j], i, j);
                        }
                    }
                }
            };

            graph.toString = function() {
                var str = "";
                for (var i = 0; i < mtx.length; i++) {
                    var j = graph.isOriented ? 0 : i;
                    for (; j < mtx[i].length; j++) {
                        if (mtx[i][j]) {
                            str += i + "-" + j +"["+ mtx[i][j].weight +"],";
                        }
                    }
                }
                return str;
            };

            graph.getDegreeOfVertex = function(v) {
                if (typeof v === "number") {
                    if (v >= 0 && v < vertices.length) {
                        var n = 0;
                        for (var i = 0; i < mtx[v].length; i++) {
                            n = mtx[v][i] ? n + 1 : n;
                        }
                        return n;
                    }
                } else if (typeof v === "object") {
                    return graph.getDegreeOfVertex(vertices.indexOf(v));
                }
            };

        } else {
            //TODO
        }
    }

    //Necessário para o módulo do node.js
//    exports.Graph = Graph;
//    exports.GraphFiller = GraphFiller;
//    exports.Search = Search;
//    exports.Eulerian = Eulerian;

    return {
        Graph: Graph,
        GraphFiller: GraphFiller,
        Search: Search,
        Eulerian: Eulerian
    };

})();




