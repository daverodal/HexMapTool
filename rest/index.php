<?php
if($_SERVER['REQUEST_METHOD'] == 'PUT'){
    $putdata = fopen("php://input", "r");
    $pInfo = $_SERVER['PATH_INFO'];

    /* Open a file for writing */
    $fp = fopen("/tmp$pInfo", "w");

    /* Read the data 1 KB at a time
       and write to the file */
    while ($data = fread($putdata, 1024))
        fwrite($fp, $data);

    /* Close the streams */
    fclose($fp);
    fclose($putdata);
    exit();
}
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $id = file_get_contents("/tmp/maps/id");
    file_put_contents("/tmp/maps/id",$id+1);
    $id = trim($id);
    $putdata = fopen("php://input", "r");
    $pInfo = $_SERVER['PATH_INFO'];

    /* Open a file for writing */
    $fp = fopen("/tmp/maps/$id", "w");

    /* Read the data 1 KB at a time
       and write to the file */
    while ($data = fread($putdata, 1024))
        fwrite($fp, $data);

    /* Close the streams */
    fclose($fp);
    fclose($putdata);
    $ret = json_decode(file_get_contents("/tmp/maps/$id"));
    $ret->map->id = $id;
    header('Content-type: application/json');
    echo json_encode($ret);
    exit();

}

$pInfo = $_SERVER['PATH_INFO'];
if(true){
    if ($handle = opendir('/tmp/maps')) {


        $maps = array();
        /* This is the correct way to loop over the directory. */
        while (false !== ($entry = readdir($handle))) {
            if($entry === "." || $entry === ".." || $entry === "id"){
                continue;
            }
            $map = json_decode(file_get_contents("/tmp/maps/$entry"));
            $map->map->id = $entry;
            $maps[] = $map->map;
        }
        $top = new stdClass();
        $top->maps = $maps;
        header('Content-type: application/json');
        echo json_encode($top);
        exit();


    }
}
if($pInfo == "/maps"){

    $x = new stdClass();

    $x->id = 1;
    $x->mapUrl =  "http://davidrodal.com/Battle/js/MartianIV.png";
    $x->numX =  20;
    $x->numY =  12;
    $x->x = 0;
    $x->y = 0;
    $x->a = 15;
    $x->b = 25;
    $x->c = 30;
    $x->perfect = false;
    $maps = array($x);

    $x = new stdClass();

    $x->id = 2;
    $x->mapUrl = "http://davidrodal.com/Battle/js/MCW.png";
    $x->numX =  13;
    $x->numY =  20;
    $x->x = 7;
    $x->y = 0;
    $x->a = 16;
    $x->b = 27.712812921102035;
    $x->c = 32;
    $x->perfect = false;

    $maps[] = $x;
    $top = new stdClass();
    $top->maps = $maps;
    header('Content-type: application/json');
    echo json_encode($top);
    exit();
//        id:2,
//        mapUrl:"http://davidrodal.com/Battle/js/MCW.png",
//        numX: 13,
//        numY: 20,
//        x:7,
//        y:20,
//        hexSize:32,
//        a:16,
//        b:10,
//        c:32,
//        perfect:false





}
if (false){
    if($pInfo != '/posts'){

        $splode = explode("/",$pInfo);
        $id = $splode[2];
        $obj = json_decode(file_get_contents("http://127.0.0.1:5984/posts/$id"));
        $ret = new stdClass();
        $ret->post = $obj;
        echo json_encode($ret);
        exit();
        echo file_get_contents("/tmp/$pInfo");
        exit();
    }
    $obj = json_decode(file_get_contents("http://127.0.0.1:5984/posts/_design/posts/_view/posts"));
    foreach($obj->rows as $row){
        $row = $row->value;
        $row->id = $row->_id;
        $posts[] = $row;
    }
    $top = new stdClass();
    $top->posts = $posts;
    header('Content-type: application/json');
    echo json_encode($top);
    exit();
    var_dump($posts);

    $posts = $obj->rows;
    $posts = array();
    $directory = "/tmp/posts";
    $iterator = new DirectoryIterator($directory);
    foreach ($iterator as $fileinfo) {
        if ($fileinfo->isFile()) {
            $post = json_decode(file_get_contents($fileinfo->getPathname()));
            $post = $post->post;
            $post->id = $fileinfo->getFilename();
            $posts[] = $post;
        }
    }

}

$x = new stdClass();
$x->id = "a";
$x->title = "The Title";
$x->author = "art the artist";
$x->intro = "The golden age of ballooning";
$x->extended = "IT's monty pythons flying circus";

$posts = array($x);
$x = new stdClass();
$x->id = "love";
$x->title = "The Other Title";
$x->author = "science";
$x->intro = "Another exciting episode of Bicycle Repair Man";
$x->extended = "I am a lumberjack i am okay";

$posts[] = $x;

$top = new stdClass();
$top->posts = $posts;
header('Content-type: application/json');
echo json_encode($top);