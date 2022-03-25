<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function files(){
        return $this->hasMany(File::class);
    }

    public function master_group(){
        return $this->hasOne(Group::class)->where("is_master", true);
    }

    public function joined_groups(){
        return $this->hasManyThrough(GroupUser::class, Group::class)->where("accepted", true);
    }

    public function groups_user(){
        return $this->hasMany(GroupUser::class)->where("accepted", true);
    }

    public function groups(){
        return $this->hasMany(Group::class);
    }

    public function invites(){
        return $this->hasManyThrough(GroupUser::class, Group::class)
                        ->where("accepted", false);
    }

    public function requests(){
        return $this->hasMany(GroupUser::class)
                ->where("accepted", false);
    }

    public function getRouteKeyName()
    {
        return 'username';
    }
}
