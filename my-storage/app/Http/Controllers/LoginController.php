<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginStoreRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function store(LoginStoreRequest $request){
        //get the user
        $user = User::where('username', $request->username)->first();

        //check whether the password match
        if (!$user || !Hash::check($request->password, $user->password)){
            abort(400, 'Username or Password is worng.');
        }

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $user->createToken('web')->plainTextToken,
            ],
        ]);
    }

    public function destroy($request){
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
