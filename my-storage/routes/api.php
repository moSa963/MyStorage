<?php

use App\Http\Controllers\DirectoriesController;
use App\Http\Controllers\FileGroupController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\FileSearchController;
use App\Http\Controllers\GroupDirectoriesController;
use App\Http\Controllers\GroupMembersController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileImageController;
use App\Http\Controllers\RecycleBinController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SessionAuth\EmailVerificationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * User
 */
Route::get('/user', [UserController::class, 'show'])
->middleware('auth:sanctum');

Route::post('/user/update', [UserController::class, 'update'])
->middleware('auth:sanctum');


/**
 * Registration
 */
Route::post('/register', [RegisterController::class, 'store']);

Route::post('/login', [LoginController::class, 'store']);

Route::post('/logout', [LoginController::class, 'destroy'])
->middleware('auth:sanctum');

Route::post('/verifie', [EmailVerificationController::class, 'verifie'])
->middleware('auth:sanctum');

Route::put('/verifie', [EmailVerificationController::class, 'update'])
->middleware('auth:sanctum');


Route::middleware(["auth:sanctum", "verified"])->group(function(){

    /**
     * File
     */
    Route::controller(FilesController::class)->group(function(){
        Route::get('/group/{group}/file/{file}', 'index');
        
        Route::get('/group/{group}/file/{file}/info', 'show');
        
        Route::post('/directory/{directory}/file', 'store');
        
        Route::put('/file/{file:id}/move/{from}/{to}', 'move');
        
        Route::post('/file/{file}/update', 'update');
    
        Route::delete('/group/{group}/file/{file}', 'destroy');
    });
    
    Route::post('/directory/{directory}/reference/file/{file}', [FileGroupController::class, 'store']);
    
    
    /**
     * Directory
     */
    Route::controller(DirectoriesController::class)->group(function(){
        Route::post('group/{group:id}/directory/{directory:id}', 'store');

        Route::post('/directory/{directory}/update', 'update');
    
        Route::delete('/directory/{directory}', 'destroy');
    
        Route::put('/directory/{directory}/move/{destination}', 'move');
    
        Route::get('/directory/{path}', 'index')
        ->where(['path' => '.*']);
    });
    
    Route::get('/group/{group}/directory/{path}', [GroupDirectoriesController::class, 'index'])
    ->where(['path' => '.*']);
    
    /**
     * Group
     */
    Route::controller(GroupsController::class)->group(function(){
        Route::get('/group', 'index');
    
        Route::get('/group/{group:id}', 'show');
        
        Route::post('/group', 'store');
        
        Route::post('/group/{group:id}', 'update');
        
        Route::delete('/group/{group:id}', 'destroy');
    });

    
    /**
     * Members
     */
    Route::controller(GroupMembersController::class)->group(function(){
        Route::get('/group/{group}/members', 'show');
    
        Route::post('/group/{group}/request/{user}', 'store');
        
        Route::put('/group/request/{groupUser}', 'update');

        Route::put('/group/member/{groupUser}/{permission}', 'update_permission');
        
        Route::delete('/group/member/{groupUser}', 'destroy');
    });
    
    /**
     * Recycle Bin
     */
    Route::controller(RecycleBinController::class)->group(function(){
        Route::get('/bin', 'index');
    
        Route::put('/bin/file/{file}', 'update');
        
        Route::delete('/bin', 'destroy');
    });


    /**
     * Notification
     */
    Route::get('/notification', [NotificationController::class, "index"]);

    
    /**
     * profile image
     */
    Route::get('/image/group/{group:id}', [ProfileImageController::class, 'show_group']);
    
    Route::get('/image/user/{user}', [ProfileImageController::class, 'show_user']);
});