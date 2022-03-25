<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerfieEmailCode extends Model
{
    use HasFactory;

    public $table = "verfie_email_codes";

    protected $fillable = [
        'user_id',
        'code',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
