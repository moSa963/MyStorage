<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    public $table = "files";

    protected $fillable = [
        'user_id',
        'name',
        'storage_path',
        'extension',
        'size',
        'mime_type',
    ];
    
    protected $hidden = [
        'storage_path',
    ];
    
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function directories_file(){
        return $this->hasMany(DirectoryFile::class, "file_id", "id");
    }

    public function directories(){
        return $this->belongsToMany(Directory::class, "directories_files");
    }

    public function master_directory(){
        return $this->belongsToMany(Directory::class, "directories_files")
                        ->where("group_id", $this->user->master_group->id);
    }

    public function groups(){
        return $this->belongsToMany(Directory::class, "directories_files")
                        ->join("groups", "groups.id", "=", "directories.group_id")
                        ->select("groups.id", "groups.name");
    }

    public function bin(){
        return $this->hasOne(Bin::class);
    }
}
