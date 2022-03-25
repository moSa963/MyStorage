<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    public $table = "groups";

    protected $fillable = [
        'user_id',
        'name',
        'is_master',
        'private',
    ];

    protected $hidden = [
        'image',
    ];

    public function user(){
        return $this->belongsTo(User::class, "user_id");
    }

    public function directories(){
        return $this->hasMany(Directory::class);
    }

    public function users(){
        return $this->hasMany(GroupUser::class)->where("accepted", true);
    }

    public function directory_files(){
        return $this->hasManyThrough(DirectoryFile::class, Directory::class);
    }
}
