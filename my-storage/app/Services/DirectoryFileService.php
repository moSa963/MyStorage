<?php

namespace App\Services;

use App\Models\Directory;
use App\Models\DirectoryFile;
use App\Models\File;
use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DirectoryFileService
{

    /**
     * Delete all file references that belong to a user
     */
    public static function delete_if_belong_to(User $user, Group $group)
    {
        DirectoryFile::select('directories_files.*')
            ->join('files', 'files.id', '=', 'directories_files.file_id')
            ->join('users', 'users.id', '=', 'files.user_id')
            ->where('users.id', $user->id)
            ->join('directories', 'directories.id', '=', 'directories_files.directory_id')
            ->join('groups', 'groups.id', '=', 'directories.group_id')
            ->where('groups.id', $group->id)
            ->delete();
    }


    /**
     * get list of files in the folder and its childes folders
     */
    public static function get_files_recursive(Directory $directory) 
    {
        return File::select('files.*', DB::raw("CONCAT(directories.location, '/', directories.name) AS original_location"))
                ->join('directories_files', 'directories_files.file_id', '=', 'files.id')
                ->join('directories', 'directories.id', '=', 'directories_files.directory_id')
                ->join('groups', 'groups.id', '=', 'directories.group_id')
                ->where('groups.id', $directory->group->id)
                ->where('directories.location', 'LIKE', $directory->location . '/' . $directory->name . '%')
                ->orWhere('directories.id', $directory->id)
                ->get();
    }

}