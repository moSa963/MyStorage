<?php

namespace App\Listeners;

use App\Mail\VerifyEmailMail;
use App\Models\VerfieEmailCode;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SendEmailVerificationNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(Registered $event)
    {
        try{
            if ($event->user instanceof MustVerifyEmail && ! $event->user->hasVerifiedEmail()){
                $code = VerfieEmailCode::where('user_id', $event->user->id)->first();
    
                if (! $code){
                    $code = VerfieEmailCode::create([
                        'user_id' => $event->user->id,
                        'code' => Str::random(6),
                    ]);
                } else {
                    $code->code = Str::random(6);
                    $code->save();
                }
    
                Mail::to($event->user)->send(new VerifyEmailMail($event->user, $code->code));
            }
        } catch(Exception $e){

        }
    }
}
