$(function () {

    load_test($("#N").val());

    $("#reload").click(function(){
        load_test($("#N").val());
    });
});

function load_test(N){
    $('.loader').fadeIn('slow');

    var numbers_tmp = [];
    var i = 0, js_runs = 0, php_runs = 0, php_mt_runs = 0, php_random_org_runs = 0;

    for(i = 0; i < N; i++){
        numbers_tmp[i] = Math.round(Math.random() * 10);
    }

    js_runs = get_runs(numbers_tmp);

    $.get("php_rand.php", {qnt: N}, function(res){
        res = JSON.parse(res);
        php_runs = get_runs(res.rand);
        php_mt_runs = get_runs(res.mt_rand);
        php_random_org_runs = get_runs(res.random_org);

        load_chart(N, js_runs, php_runs, php_mt_runs, js_runs, php_random_org_runs);
        $('.loader').fadeOut('fast');
    });
}

/**
 * return runs from array of random-generated numbers
 */
function get_runs(numbers){
    var up_down = [];
    var runs = 0;
    for(i = 0; i < numbers.length - 1; i++){
        up_down[i] = numbers[i] > numbers[i+1] ? 0 : 1;
    }
    for(i = 0; i < numbers.length - 1; i++){
        if(up_down[i] !== up_down[i+1]) runs++;
    }
    return runs;
}

/**
 * Draw chart with runs passed as parameters
 */
function load_chart(N, js, php, php_mt, ruby, online){
    $('#chart').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Random generators runs"
        },
        xAxis: {
            type: "method"
        },
        yAxis: {
            title: {
                text: "runs on " + N + " numbers"
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
            pointFormat: "<span style=\"color:{point.color}\">{point.name}</span> runs<br/>"
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
                name: 'Online random.org',
                y: online,
                drilldown: 'Online random.org'
            }]
        }]
    });
}
