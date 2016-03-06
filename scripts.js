$(function () {

    load_test($("#N").val());

    $("#reload").click(function(){
        load_test($("#N").val());
    });
});

function load_test(N){
    var numbers_tmp = [];
    var i = 0, js_rushes = 0, php_rushes = 0, php_mt_rushes = 0;

    for(i = 0; i < N; i++){
        numbers_tmp[i] = Math.round(Math.random() * 10);
    }

    js_rushes = get_rushes(numbers_tmp);

    $.get("php_rand.php", {qnt: N}, function(res){
        res = JSON.parse(res);
        php_rushes = get_rushes(res.rand);
        php_mt_rushes = get_rushes(res.mt_rand);

        load_chart(N, js_rushes, php_rushes, php_mt_rushes, js_rushes, php_rushes);
    });
}

/**
 * return rushes from array of random-generated numbers
 */
function get_rushes(numbers){
    var up_down = [];
    var rushes = 0;
    for(i = 0; i < numbers.length - 1; i++){
        up_down[i] = numbers[i] > numbers[i+1] ? 0 : 1;
    }
    for(i = 0; i < numbers.length - 1; i++){
        if(up_down[i] !== up_down[i+1]) rushes++;
    }
    return rushes;
}

/**
 * Draw chart with rushes passed as parameters
 */
function load_chart(N, js, php, php_mt, ruby, online){
    $('#chart').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Random generators rushes"
        },
        xAxis: {
            type: "method"
        },
        yAxis: {
            title: {
                text: "Rushes on " + N + " numbers"
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },

        tooltip: {
            headerFormat: "<span style=\"font-size:11px\">{series.name}</span><br>",
            pointFormat: "<span style=\"color:{point.color}\">{point.name}</span> rushes<br/>"
        },

        series: [{
            name: 'Generators',
            colorByPoint: true,
            data: [{
                name: 'JS Math.random()',
                y: js,
                drilldown: 'JS Math.random()'
            }, {
                name: 'PHP rand()',
                y: php,
                drilldown: 'PHP rand()'
            }, {
                name: 'PHP mt_rand()',
                y: php_mt,
                drilldown: 'PHP mt_rand()'
            }, {
                name: 'Ruby rand() FAKE',
                y: ruby,
                drilldown: 'Ruby rand() FAKE'
            }, {
                name: 'Online random FAKE',
                y: online,
                drilldown: 'Online random FAKE'
            }]
        }]
    });
}
