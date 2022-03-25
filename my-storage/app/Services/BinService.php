<?php

namespace App\Services;

use App\Models\Bin;
use App\Models\Directory;
use App\Models\File;
use App\Models\Group;

class BinService
{
    public static function move_file_to_bin(Group $group, File $file) : Bin
    {
        $directory = $group->directory_files("file_id", $file->id)->first()->directory;
        
        $file->directories_file()->delete();

        return Bin::create([
            'file_id' => $file->id,
            'original_location' => $directory->location . '/' . $directory->name,
        ]);
    }

    public static function move_directory_to_bin(Directory $directory)
    {
        $files = DirectoryFileService::get_files_recursive($directory);

        Bin::insert($files->map(function($item){
            return [
                'file_id' => $item->id,
                'original_location' => $item->original_location,
            ];
        })->toArray());

        $files->each(function($file) {
            $file->directories_file()->delete();
        });

        $directory->directories()->delete();
        $directory->delete();
    }
}
