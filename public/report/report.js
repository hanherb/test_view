var address = 'http://' + window.location.hostname;
//menampilkan list consult pada halaman report.html
function listConsult() {
    var query = "query getAllConsult {\n  \t\tconsults {\n\t\t\tdoctor_name\n\t    \tpatient_name\n\t    \tcheckin_date\n\t    \tconsult_date\n\t    \tstatus\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        for (var i = 0; i < data.data.consults.length; i++) {
            var doctor_name = data.data.consults[i].doctor_name;
            var patient_name = data.data.consults[i].patient_name;
            var checkin_date = data.data.consults[i].checkin_date;
            var consult_date = data.data.consults[i].consult_date;
            var status_1 = data.data.consults[i].status;
            if (doctor_name) {
                $('#tableConsult tbody').append('<tr class="tr_data">' +
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + doctor_name + '</td>' +
                    '<td>' + patient_name + '</td>' +
                    '<td>' + checkin_date + '</td>' +
                    '<td>' + consult_date + '</td>' +
                    '<td>' + status_1 + '</td>' +
                    '</tr>');
            }
        }
        $('#tableConsult').after('<button class="btn btn-primary btn-print" name="consult" id="print-consult" onclick="startPrint(this.name)">Print</button>');
    });
}
//--
//mendapatkan data consult
function getConsult(callback) {
    var query = "query getAllConsult {\n  \t\tconsults {\n\t\t\tdoctor_name\n\t    \tpatient_name\n\t    \tcheckin_date\n\t    \tconsult_date\n\t    \tstatus\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        if (callback)
            return callback(data.data.consults);
    });
}
//--
//menampilkan list transaction pada halaman report.html
function listTransaction() {
    var query = "query getAllTransaction {\n  \t\ttransactions {\n\t\t\tpatient_name\n\t  \t\tmedicine\n\t  \t\ttransaction_date\n\t  \t\tprice\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        for (var i = 0; i < data.data.transactions.length; i++) {
            var patient_name = data.data.transactions[i].patient_name;
            var medicine = data.data.transactions[i].medicine;
            var transaction_date = data.data.transactions[i].transaction_date;
            var price = data.data.transactions[i].price;
            $('#tableTransaction tbody').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + patient_name + '</td>' +
                '<td>' + medicine + '</td>' +
                '<td>' + price + '</td>' +
                '<td>' + transaction_date + '</td>' +
                '</tr>');
        }
        $('#tableTransaction').after('<button class="btn btn-primary btn-print" name="transaction" id="print-transaction" onclick="startPrint(this.name)">Print</button>');
    });
}
//--
//mendapatkan data transaction
function getTransaction(callback) {
    var query = "query getAllTransaction {\n  \t\ttransactions {\n\t\t\tpatient_name\n\t  \t\tmedicine\n\t  \t\ttransaction_date\n\t  \t\tprice\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        if (callback)
            return callback(data.data.transactions);
    });
}
//--
//menampilkan list item pada halaman report.html
function listCommerce() {
    var query = "query getAllCommerce {\n  \t\tcommerces {\n\t\t\tname\n\t  \t\tqty\n\t  \t\tprice\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        for (var i = 0; i < data.data.commerces.length; i++) {
            var name_1 = data.data.commerces[i].name;
            var qty = data.data.commerces[i].qty;
            var price = data.data.commerces[i].price;
            $('#tableCommerce tbody').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + name_1 + '</td>' +
                '<td>' + qty + '</td>' +
                '<td>' + price + '</td>' +
                '</tr>');
        }
        $('#tableCommerce').after('<button class="btn btn-primary btn-print" name="commerce" id="print-commerce" onclick="startPrint(this.name)">Print</button>');
    });
}
//--
//mendapatkan data commerce
function getCommerce(callback) {
    var query = "query getAllCommerce {\n  \t\tcommerces {\n\t\t\tname\n\t  \t\tqty\n\t  \t\tprice\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        if (callback)
            return callback(data.data.commerces);
    });
}
//--
//menampilkan list supply pada halaman report.html
function listSupply() {
    var query = "query getAllSupply {\n  \t\tsupplies {\n\t\t\tsupplier_name\n\t  \t\tmedicine\n\t  \t\tqty\n\t  \t\tsupply_date\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        for (var i = 0; i < data.data.supplies.length; i++) {
            var supplier_name = data.data.supplies[i].supplier_name;
            var medicine = data.data.supplies[i].medicine;
            var qty = data.data.supplies[i].qty;
            var supply_date = data.data.supplies[i].supply_date;
            $('#tableSupply tbody').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + supplier_name + '</td>' +
                '<td>' + medicine + '</td>' +
                '<td>' + qty + '</td>' +
                '<td>' + supply_date + '</td>' +
                '</tr>');
        }
        $('#tableSupply').after('<button class="btn btn-primary btn-print" name="supply" id="print-supply" onclick="startPrint(this.name)">Print</button>');
    });
}
//--
//mendapatkan data supply
function getSupply(callback) {
    var query = "query getAllSupply {\n  \t\tsupplies {\n\t\t\tsupplier_name\n\t  \t\tmedicine\n\t  \t\tqty\n\t  \t\tsupply_date\n\t  \t}\n\t}";
    fetch(address + ':3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {}
        })
    }).then(function (r) { return r.json(); }).then(function (data) {
        if (callback)
            return callback(data.data.supplies);
    });
}
//--
//print kedalam format csv
function startPrint(name) {
    if (name == 'consult') {
        getConsult(function (result) {
            setTimeout(function () {
                downloadCSV({ filename: "consult.csv", data: result });
            }, 2000);
        });
    }
    else if (name == 'transaction') {
        getTransaction(function (result) {
            setTimeout(function () {
                downloadCSV({ filename: "transaction.csv", data: result });
            }, 2000);
        });
    }
    else if (name == 'commerce') {
        getCommerce(function (result) {
            setTimeout(function () {
                downloadCSV({ filename: "commerce.csv", data: result });
            }, 2000);
        });
    }
    else if (name == 'supply') {
        getSupply(function (result) {
            setTimeout(function () {
                downloadCSV({ filename: "supply.csv", data: result });
            }, 2000);
        });
    }
}
function convertArrayOfObjectsToCsv(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }
    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';
    keys = Object.keys(data[0]);
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0)
                result += columnDelimiter;
            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });
    return 'sep=,\r\n' + result;
}
function downloadCSV(args) {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCsv({
        data: args.data
    });
    if (csv == null)
        return;
    filename = args.filename || 'export.csv';
    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}
//--
