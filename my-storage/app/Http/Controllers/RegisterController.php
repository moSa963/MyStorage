<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterStoreRequest;

class RegisterController extends Controller
{
    public function store(RegisterStoreRequest $request){
        $user = $request->store();

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $user->createToken('web')->plainTextToken,
            ],
        ]);
    }
}