


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
            if (d.From.split("@")[0] === data.nodes[i].email.split("@")[0]) {
                f = i;
                break;
            }
        }
        tAux = d.To.split(",");
        for (var j = 0; j < tAux.length; j++) {
            for (var i = 0; i < data.nodes.length; i++) {
                if (tAux[j].split("@")[0] === data.nodes[i].email.split("@")[0]) {
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
        var dataSubject = [];
        for (var i = 0; i < rows2.length; i++) {

            for (var j = 0; j < rows2[i].to.length; j++) {
                eAux = graph.getEdge(rows2[i].from, rows2[i].to[j]);
                if (eAux) {
                    eAux.weight++;
                    eAux.tags = getFrequency(rows2[i].subject, eAux.tags);

                    var eAux2 = graph.getEdge(rows2[i].to[j], rows2[i].from);
                    eAux2.weight++;
                    eAux2.tags = eAux.tags;
                } else {
                    graph.insertEdge(rows2[i].from, rows2[i].to[j]);
                    var e = graph.getEdge(parseInt(rows2[i].from), parseInt(rows2[i].to[j]));
                    e.tags = getFrequency(rows2[i].subject);

                    var e2 = graph.getEdge(parseInt(rows2[i].to[j]), parseInt(rows2[i].from));
                    e2.tags = e.tags;
                }
            }

        }

        data.links = [];
        data.subjects = [];
        var subjAux = {};
        for (var i = 0; i < rows2.length; i++) {
            rows2[i].subject = rows2[i].subject.replace(/RE:/, "");
            rows2[i].subject = rows2[i].subject.trim();
            if(subjAux[rows2[i].subject]){
                subjAux[rows2[i].subject].freq++;
                subjAux[rows2[i].subject].date.push(rows2[i].date);
            }else{
                 subjAux[rows2[i].subject] = {};
                subjAux[rows2[i].subject].freq = 1;
                subjAux[rows2[i].subject].date = [];
                subjAux[rows2[i].subject].date.push(rows2[i].date);
                
            }
        }
        for(var text in subjAux){
            data.subjects.push({"text":text+subjAux[text].date, "frequency":subjAux[text].freq});
        }
        graph.forEachEdge(function(e) {

            if (!(e.visited)) {
                data.links.push({source: e.i1, target: e.i2, weight: e.weight, tags: e.tags});
                e.visited = true;
                var e2 = graph.getEdge(e.i2, e.i1);
                e2.visited = true;
            }

        });

        document.write(JSON.stringify(data));


    });

});




function getFrequency(text, update) {
    var sWords = text.toLowerCase().trim().replace(/[,;:\.\-\!\?]/g, '').split(/[\s\/]+/g).sort();
    var iWordsCount = sWords.length; // count w/ duplicates

    for (var i = 0; i < iWordsCount; i++) {
        if (sWords[i] === "") {
            sWords.splice(i, 1);
            i--;
        }
    }

    // array of words to ignore
    var ignore = ['you','me','re', '-', 'and', 'the', 'to', 'a', 'of', 'for', 'as', 'i', 'with', 'it', 'is', 'on', 'that', 'this', 'can', 'in', 'be', 'has', 'if'];
    ignore = (function() {
        var o = {}; // object prop checking > in array checking
        var iCount = ignore.length;
        for (var i = 0; i < iCount; i++) {
            o[ignore[i]] = true;
        }
        return o;
    }());

    var counts = {}; // object for math
    if (update) {
        for (var i = 0; i < update.length; i++) {
            counts[update[i].text] = update[i].frequency;
        }
    }
    for (var i = 0; i < iWordsCount; i++) {
        var sWord = sWords[i];
        if (!ignore[sWord]) {
            counts[sWord] = counts[sWord] || 0;
            counts[sWord]++;
        }
    }

    var arr = []; // an array of objects to return
    for (sWord in counts) {
        arr.push({
            text: sWord,
            frequency: counts[sWord]
        });
    }

    return arr.sort(function(a, b) {
        return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
    });
}

