<?php

namespace App\Services;

use App\Models\DirectoryFile;
use App\Models\Group;
use App\Models\User;
use App\Models\Directory;
use App\Models\File;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public static function deleteFiles($files){
        $storage_paths = [];

        $sql = File::select('id');

        foreach($files as $file){
            $storage_paths[] = $file->storage_path;
            $sql = $sql->orWhere('id', $file->id);
        }
        
        Storage::delete($storage_paths);
        $sql->delete();
    }

    public static function deleteFile(Group $group, File $file){
        if (! $group->is_master){
            $group->directory_files()->where("file_id", $file->id)->delete();
            return;
        }
        
        if (! $file->bin()->exists()){
            BinService::move_file_to_bin($group, $file);
            return;
        }

        Storage::delete($file->storage_path);
        $file->delete();
    }

    public static function move_location(File $file, Directory $from, Directory $to){
        
        if (DirectoryService::name_exists($to, $file->name, $file->extension)) {
            return false;
        }

        DirectoryFile::where('file_id', $file->id)
                    ->where('directory_id', $from->id)
                    ->update(['directory_id' => $to->id]);

        return true;
    }

    public static function reference(User $user, File $file, Directory $directory)
    {
        if ($user->id != $file->user_id){
            abort(403);
        }

        if ($directory->group->is_master){
            abort(403, "you can not reference a file in a master group");
        }

        DirectoryFile::create([
            'directory_id' => $directory->id,
            'file_id' => $file->id,
        ]);
    }
}