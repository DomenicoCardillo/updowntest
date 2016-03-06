<?php

    $qnt = $_GET['qnt'];
    $tmp = 0;

    $rand_numbers = array();
    for($i = 0; $i < $qnt; $i++){
        $tmp = rand() % 10;
        array_push($rand_numbers, $tmp);
    }

    $mt_rand_numbers = array();
    for($i = 0; $i < $qnt; $i++){
        $tmp = rand() % 10;
        array_push($mt_rand_numbers, $tmp);
    }

	// Get random number of random.org
    $random_org_numbers = array();
    $url = 'https://api.random.org/json-rpc/1/invoke';
    $header = array('Content-Type: application/json');
    $body = array(
        'id'      => 1,
    	'jsonrpc' => '2.0',
    	'method'  => 'generateDecimalFractions',
        'params'  => array(
            "apiKey"        => "b5cc2b39-2385-4195-a328-f1f45f85832a",
            "n"             => $qnt,
            "decimalPlaces" => 1,
            "replacement"   => true
        )
    );

    $curl = curl_init();

    curl_setopt($curl,CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);                                               
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body));

    $response = json_decode(curl_exec($curl));
    curl_close($curl);

    $random_org_numbers = $response->result->random->data;

    echo json_encode(
        array(
            'rand'       => $rand_numbers, 
            'mt_rand'    => $mt_rand_numbers,
            'random_org' => $random_org_numbers
        )
    );
?>
