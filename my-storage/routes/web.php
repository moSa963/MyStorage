<?php

use App\Http\Controllers\SessionAuth\SessionLoginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });


Route::post('register',  [SessionLoginController::class, 'register']);

Route::post('login',  [SessionLoginController::class, 'login']);

Route::delete('logout',  [SessionLoginController::class, 'destroy']);

Route::view("/{path}", "index")->where("path", "(.*)");