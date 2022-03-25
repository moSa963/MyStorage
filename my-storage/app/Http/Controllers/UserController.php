<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(Request $request){
        return $request->user();
    }

    public function update(UpdateUserRequest $request){
        $request->update($request->user());

        return response()->noContent();
    }
}
