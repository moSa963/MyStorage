<?php

namespace App\Services;

use App\Models\Directory;
use App\Models\DirectoryFile;
use App\Models\File;
use App\Models\Group;
use Illuminate\Support\Facades\DB;

class DirectoryService
{

    public static function get_directory(Group $group, string $path)
    {
        $path = str_starts_with($path, '/') ? $path : '/'.$path;

        $path_parts = explode('/', $path);

        $name = array_pop($path_parts);

        return $group->directories()
                        ->where('location', implode('/', $path_parts))
                        ->where('name', $name)
                        ->firstOrFail();
    }

    public static function findOrCreatePath($group_id, $path) : Directory | null{
        $path_parts = explode('/', $path);

        if(sizeof($path_parts) <= 1 || $path_parts[1] != 'root'){
            return false;
        }

        $last_dir = null;
        
        for ($i = 1; $i < sizeof($path_parts); ++$i){
            $last_dir = Directory::firstOrCreate([
                'group_id' => $group_id,
                'name' => $path_parts[$i],
                'location' => implode('/', array_slice($path_parts, 0, $i)),
            ]);
        }

        return $last_dir;
    }

    /**
     * get all files in this directory or in its children directories
     */
    public static function allFiles(Directory $directory){
        return File::join('directories_files', 'directories_files.file_id', '=', 'files.id')
                        ->join('directories', 'directories.id', '=', 'directories_files.directory_id')
                        ->where('directories.group_id', $directory->group_id)
                        ->where('directories.location', 'LIKE',  $directory->location.'/'.$directory->name.'%')
                        ->orWhere('directories.id', $directory->id)
                        ->get();
    }

    public static function delete(Directory $directory){
        if ($directory->group->is_master)
        {
            BinService::move_directory_to_bin($directory);
        }

        $directory->directories()->delete();
        $directory->delete();
        return;
    }

    public static function move_location(Directory $directory, Directory $to_dir){
        DB::transaction(function() use($directory, $to_dir){
            $old_location = $directory->location;

            $directory->update([
                "location" => $to_dir->location.'/'.$to_dir->name,
            ]);

            Directory::where('group_id', $directory->group_id)
                ->where('location', 'LIKE', $old_location.'/'.$directory->name.'%')
                ->update([
                    'location' => DB::raw("REPLACE(location, '".$old_location."', '".$directory->location."')")
                ]);
        });
    }

    public static function rename(Directory $directory, $name){
        DB::transaction(function() use($directory, $name) {
            $old_name = $directory->name;

            $directory->update([
                "name" => $name,
            ]);

            Directory::where('group_id', $directory->group_id)
                ->where('location', 'LIKE', $directory->location.'/'.$old_name.'%')
                ->update([
                    'location' => DB::raw("REPLACE(`location`, '".$directory->location.'/'.$old_name."', '".$directory->location.'/'.$name."')")
                ]);
        });

        return $directory;
    }

    /**
     * Determine if there is a file in this directory that has the same name and extension
     */
    public static function name_exists(Directory $directory, string $name, string $extension) : bool
    {
        return DirectoryFile::where('directories_files.directory_id', $directory->id)
                    ->join('files', 'files.id', '=', 'directories_files.file_id')
                    ->leftJoin('bin', 'bin.file_id', '=', 'directories_files.file_id')
                    ->where('bin.file_id', null)
                    ->Where('files.name', $name)
                    ->where('files.extension', $extension)
                    ->exists();
    }
}