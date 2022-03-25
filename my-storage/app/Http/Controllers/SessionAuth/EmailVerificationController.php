<?php

namespace App\Http\Controllers\SessionAuth;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmailVerfieRequest;
use App\Models\VerfieEmailCode;
use DateTime;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{

    public function verifie(EmailVerfieRequest $request){

        //if user email is already verified
        if ($request->user()->email_verified_at){
            return response()->json([
                'message' => 'The email has already been verified.',
            ]);
        }

        $code = VerfieEmailCode::where('user_id', Auth::user()->id)->first();
        
        //check if the code time
        if (!$code || now()->diffInMinutes($code->updated_at) > env('EMAIL_CODE_LIFETIME_MINUTES', 5)){
            return response()->json([
                'message' => 'This code has expired.',
            ], 403);
        }

        if ($request->code != $code->code){
            return response()->json([
                'message' => 'The code is wrong.',
            ], 400);
        }
        
        $code->delete();

        $request->user()->markEmailAsVerified();
        
        return response()->json([
            'message' => 'Email has been verified successfuly.',
        ]);
    }

    public function update(){
        //if user email is already verified
        if (Auth::user()->email_verified_at){
            return response()->json([
                'message' => 'The email has already been verified.',
            ]);
        }

        event(new Registered(request()->user()));
    }
}
