<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Directory extends Model
{
    use HasFactory;
    
    public $table = "directories";

    protected $fillable = [
        'group_id',
        'name',
        'location',
    ];

    public function group(){
        return $this->belongsTo(Group::class);
    }

    public function directory_files(){
        return $this->hasMany(DirectoryFile::class, "directory_id");
    }

    public function directories(){
        return $this->hasManyThrough(Directory::class, Group::class, "id", "group_id", "group_id", "id")
                    ->where('location', $this->location."/".$this->name);
    }

    public function files(){
        return $this->belongsToMany(File::class, "directories_files");
    }
}
