<?php

define('LARAVEL_START', microtime(true));

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Console\Input\ArrayInput;

/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/bootstrap/app.php';

$input = new ArrayInput(['command' => 'db:sync-egadget']);
$status = $app->handleCommand($input);

exit($status);
