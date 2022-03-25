<?php

namespace App\Http\Controllers\SessionAuth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginStoreRequest;
use App\Http\Requests\RegisterStoreRequest;
use App\Models\Directory;
use App\Models\Group;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SessionLoginController extends Controller
{
    public function register(RegisterStoreRequest $request){
        $user = $request->store();
        
        Auth::login($user);

        return response()->json([
            'message' => 'new user registered',
        ]);
    }


    public function login(LoginStoreRequest $request){
        if (Auth::attempt($request->only(['username', 'password'], $request->remember))){
            $request->session()->regenerate();

            return response()->json([
                'message' => 'logged in successfuly',
                'user' => Auth::user(),
            ], 200);
        }

        return response()->json([
            'message' => 'username or passwored is wrong.',
        ], 400);
    }

    public function destroy(Request $request){
        Auth::logout();

        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    }
}
