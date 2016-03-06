$(function () {

    load_test($("#N").val(), $("#alpha").val());

    $("#reload").click(function(){
        load_test($("#N").val(), $("#alpha").val());
    });
});

function load_test(N, alpha){
    $('.loader').show();

    var numbers_tmp = [];
    var js_runs = 0,
        php_runs = 0,
        php_mt_runs = 0,
        random_org_runs = 0;

    var js_critical = 0,
        php_critical = 0,
        php_mt_critical = 0,
        random_org_critical = 0;

    for(var i = 0; i < N; i++){
        numbers_tmp[i] = Math.round(Math.random() * 10);
    }

    js_runs = get_runs(numbers_tmp);
    js_critical = calc_critical_value(N, js_runs);

    $.get("php_rand.php", {qnt: N}, function(res){
        res = JSON.parse(res);

        php_runs = get_runs(res.rand);
        php_critical = calc_critical_value(N, php_runs);

        php_mt_runs = get_runs(res.mt_rand);
        php_mt_critical = calc_critical_value(N, php_mt_runs);

        random_org_runs = get_runs(res.random_org);
        random_org_critical = calc_critical_value(N, random_org_runs);

        /* Load the chart */
        build_run_chart(N, js_runs, php_runs, php_mt_runs, js_runs, random_org_runs);
        build_critical_chart(N, js_critical, php_critical, php_mt_critical, js_critical, random_org_critical);

        /* Test TODO: Print in view */
        test(js_critical, alpha)         ? console.log('not rejected') : console.log('rejected');
        test(php_critical, alpha)        ? console.log('not rejected') : console.log('rejected');
        test(php_mt_critical, alpha)     ? console.log('not rejected') : console.log('rejected');
        test(random_org_critical, alpha) ? console.log('not rejected') : console.log('rejected');

        $('.loader').hide();
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
 * return critical value from an run length
 */
function calc_critical_value(N, num) {
    var mean = (2 * N - 1)/3;
    var variance = (16 * N - 29)/90;
    var z0 = (num - mean)/(Math.sqrt(variance));

    return parseFloat(z0.toFixed(2));
}

/**
 * test the value based on alpha
 */
function test(z0, alpha) {
    alpha = alpha || 0.05;

    var norm_std = Math.abs(calc_inv_norm_st(alpha/2));
    if (z0 >= -(norm_std) && z0 <= norm_std) return 0;
    else return 1;
}

/**
 * Excel function INV.NORM.ST(prob)
 */
function calc_inv_norm_st(p) {
    var t, v, sign;

    if(p >= 1) {
        return 7;
    } else if (p<=0) {
        return -7;
    }

    if (p < 0.5) {
        t = p;
        sign = -1;
    } else {
        t = 1 - p;
        sign = 1;
    }

    v = Math.sqrt(-2.0 * Math.log(t));
    var x = 2.515517 + (v * ( 0.802853 + v * 0.010328));
    var y = 1 + (v * (1.432788 + v * (0.189269  + v * 0.001308)));
    var Q = sign * (v - (x / y));

    return Q;
}

/**
 * Draw chart with runs passed as parameters
 */
function build_run_chart(N, js, php, php_mt, online) {
    load_chart('chart', {
        title: {
            text: "Random generators runs"
        },
        yAxis: {
            title: {
                text: "runs on " + N + " numbers"
            }
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
                name: 'Online random.org',
                y: online,
                drilldown: 'Online random.org'
            }]
        }],
        tooltip: {
            headerFormat: "<span style=\"font-size:11px\">{series.name}</span><br>",
            pointFormat: "<span style=\"color:{point.color}\">{point.name}</span> runs<br/>"
        }
    });
}

/**
 * Draw chart with critical vaule passed as parameters
 */
function build_critical_chart(N, js, php, php_mt, online) {
    load_chart('chart-2', {
        title: {
            text: "Critical values"
        },
        yAxis: {
            title: {
                text: "runs on " + N + " numbers"
            }
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
                name: 'Online random.org',
                y: online,
                drilldown: 'Online random.org'
            }]
        }],
        tooltip: {
            headerFormat: "<span style=\"font-size:11px\">{series.name}</span><br>",
            pointFormat: "<span style=\"color:{point.color}\">{point.name}</span> Critical value<br/>"
        }
    });
}

/**
 * Draw chart
 */
function load_chart(id, options) {
    var default_options = {
        chart: {
            type: "column"
        },
        xAxis: {
            type: "method"
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
        }
    };

    options = $.extend({}, default_options, options);
    $('#' + id).highcharts(options);
}