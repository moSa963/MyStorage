<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectoryFile extends Model
{
    use HasFactory;

    public $table = "directories_files";

    protected $fillable = [
        'directory_id',
        'file_id',
    ];

    public function directory(){
        return $this->belongsTo(Directory::class);
    }

    public function file(){
        return $this->belongsTo(File::class);
    }
}
