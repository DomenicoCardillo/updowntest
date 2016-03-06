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
    echo json_encode(array('rand' => $rand_numbers, 'mt_rand' => $mt_rand_numbers));

?>
