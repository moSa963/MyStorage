<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bin extends Model
{
    use HasFactory;
    
    public $table = "bin";

    protected $fillable = [
        'file_id',
        'original_location',
    ];

    public function file(){
        return $this->belongsTo(File::class);
    }
}
