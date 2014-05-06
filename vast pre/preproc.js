


var data = {};



d3.tsv("EmployeeRecords.tsv", function(d) {


    return {
        email: d.EmailAddress,
        lastName: d.LastName,
        firstName: d.FirstName,
        employmentType: d.CurrentEmploymentType,
        employment: d.CurrentEmploymentTitle
    };

}, function(error, rows) {

    data.nodes = rows;

    d3.csv("email_headers.csv", function(d) {
        var f, tAux, t = [];
        for (var i = 0; i < data.nodes.length; i++) {
            if (d.From === data.nodes[i].email) {
                f = i;
                break;
            }
        }
        tAux = d.To.split(",");
        for (var j = 0; j < tAux.length; j++) {
            for (var i = 0; i < data.nodes.length; i++) {
                if (tAux[j] === data.nodes[i].email) {
                    t.push(i);
                    break;
                }
            }
        }

        return {
            from: f,
            to: t,
            date: d.Date,
            subject: d.Subject
        };

    }, function(error, rows2) {

        var graph = new GraphJs.Graph("list"), eAux;
        for (var i = 0; i < data.nodes.length; i++) {
            graph.insertVertex();
        }

        for (var i = 0; i < rows2.length; i++) {
            
            for (var j = 0; j < rows2[i].to.length; j++) {
                eAux = graph.getEdge(rows2[i].from, rows2[i].to[j]);
                if (eAux) {
                    eAux.weight++;
                }else{
                    graph.insertEdge(rows2[i].from, rows2[i].to[j]);
                }
            }

        }
        data.links = [];
        graph.forEachEdge(function(e){
            data.links.push({source: e.i1, target: e.i2, weight: e.weight});
        });
        
        document.write(JSON.stringify(data));


    });

});


